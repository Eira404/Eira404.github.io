// vocal-lipsync.ts
type LipsyncConfig = {
  // 人声带通
  hpHz?: number;   // 默认 200
  lpHz?: number;   // 默认 4000
  // 平滑/压缩
  attackMs?: number;   // 前沿（嘴张开）平滑，默认 30ms
  releaseMs?: number;  // 后沿（嘴闭合）平滑，默认 120ms
  gateDbfs?: number;   // 噪声门阈值，默认 -55 dBFS
  inMinDbfs?: number;  // 压缩前下限，默认 -50 dBFS
  inMaxDbfs?: number;  // 压缩前上限，默认 -15 dBFS
  outMin?: number;     // 压缩后输出下限，默认 0.05（微动）
  outMax?: number;     // 压缩后输出上限，默认 1.0
  // 人声判定
  vocalRatioThresh?: number;     // 人声带通能量占比阈值，默认 0.25
  flatnessThresh?: number;       // 谱平坦度阈值（越小越像谐波/人声），默认 0.5
  holdMsWhenVocal?: number;      // 判定有人声后保持时间，默认 120ms
  // Live2D 参数名
  mouthOpenParam?: string; // "ParamMouthOpenY"
  mouthFormParam?: string; // 可选 "ParamMouthForm"
};

export class VocalLipSync {
  private ctx: AudioContext
  private srcNode: MediaElementAudioSourceNode

  // 分析节点
  private analyserFull: AnalyserNode
  private analyserVocal: AnalyserNode

  // 带通滤波（人声）
  private hp: BiquadFilterNode
  private lp: BiquadFilterNode

  // 低频链（节拍，可选）
  private beatLP: BiquadFilterNode
  private analyserBeat: AnalyserNode

  // 缓冲
  private specFull: Float32Array
  private specVocal: Float32Array
  private timeVocal: Float32Array

  // 参数
  private conf: Required<LipsyncConfig>

  // 平滑状态
  private mouthSmoothed = 0
  private lastUpdateTime = 0
  private lastVocalTime = 0
  private vocalPresent = false

  // Live2D 接口（替换成你的模型 API）
  // 仅示例：假设有一个 setParam(id, value) 方法
  constructor(
    ctx: AudioContext,
    source: MediaElementAudioSourceNode,
    private setParam: (id: string, value: number) => void,
    conf: LipsyncConfig = {}
  ) {
    this.ctx = ctx
    this.srcNode = source
    this.conf = {
      hpHz: 200,
      lpHz: 4000,
      attackMs: 30,
      releaseMs: 120,
      gateDbfs: -55,
      inMinDbfs: -50,
      inMaxDbfs: -15,
      outMin: 0.05,
      outMax: 1.0,
      vocalRatioThresh: 0.25,
      flatnessThresh: 0.5,
      holdMsWhenVocal: 120,
      mouthOpenParam: 'ParamMouthOpenY',
      mouthFormParam: 'ParamMouthForm',
      ...conf
    }

    // --- 构建人声链 ---
    this.hp = ctx.createBiquadFilter()
    this.hp.type = 'highpass'
    this.hp.frequency.value = this.conf.hpHz

    this.lp = ctx.createBiquadFilter()
    this.lp.type = 'lowpass'
    this.lp.frequency.value = this.conf.lpHz

    this.analyserVocal = ctx.createAnalyser()
    this.analyserVocal.fftSize = 2048
    this.analyserVocal.smoothingTimeConstant = 0.5

    // 源 → HP → LP → vocalAnalyser
    this.srcNode.connect(this.hp)
    this.hp.connect(this.lp)
    this.lp.connect(this.analyserVocal)

    // --- 全带分析（算能量占比、平坦度）---
    this.analyserFull = ctx.createAnalyser()
    this.analyserFull.fftSize = 2048
    this.analyserFull.smoothingTimeConstant = 0.5
    this.srcNode.connect(this.analyserFull)

    // --- 低频节拍链（可选）---
    this.beatLP = ctx.createBiquadFilter()
    this.beatLP.type = 'lowpass'
    this.beatLP.frequency.value = 150
    this.analyserBeat = ctx.createAnalyser()
    this.analyserBeat.fftSize = 1024
    this.analyserBeat.smoothingTimeConstant = 0.8
    this.srcNode.connect(this.beatLP)
    this.beatLP.connect(this.analyserBeat)

    // 缓冲
    this.specFull = new Float32Array(this.analyserFull.frequencyBinCount)
    this.specVocal = new Float32Array(this.analyserVocal.frequencyBinCount)
    this.timeVocal = new Float32Array(this.analyserVocal.fftSize)
  }

  /** 每帧调用：返回 mouthOpen（0..1）与是否有人声 */
  update(): { mouthOpen: number; vocal: boolean; beat: number } {
    const now = this.ctx.currentTime
    const dt = this.lastUpdateTime ? Math.max(0, now - this.lastUpdateTime) : 0
    this.lastUpdateTime = now

    // 1) 读取数据
    this.analyserVocal.getFloatTimeDomainData(this.timeVocal as Float32Array<ArrayBuffer>)
    this.analyserVocal.getFloatFrequencyData(this.specVocal as Float32Array<ArrayBuffer>)
    this.analyserFull.getFloatFrequencyData(this.specFull as Float32Array<ArrayBuffer>)

    // 2) 计算 RMS(dBFS)（人声带通）
    let sum = 0; let peak = 0
    for (let i = 0; i < this.timeVocal.length; i++) {
      const x = this.timeVocal[i]
      sum += x * x
      const ax = Math.abs(x)
      if (ax > peak) peak = ax
    }
    const rms = Math.sqrt(sum / this.timeVocal.length)
    const rmsDb = 20 * Math.log10(Math.max(rms, 1e-12))

    // 3) 能量占比 & 谱平坦度（越小越像谐波）
    const linVocal = this.dbToLinArray(this.specVocal)
    const linFull = this.dbToLinArray(this.specFull)
    const eVocal = sumArray(linVocal)
    const eFull = sumArray(linFull) + 1e-12
    const ratio = eVocal / eFull

    const flat = spectralFlatness(linVocal) // 0..1

    // 4) 简易 VAD：能量占比 + 平坦度
    const isVocal =
      ratio > this.conf.vocalRatioThresh && flat < this.conf.flatnessThresh

    // 加入保持时间（减少抖动）：
    if (isVocal) {
      this.vocalPresent = true
      this.lastVocalTime = now
    } else {
      const hold = this.conf.holdMsWhenVocal / 1000
      if (now - this.lastVocalTime > hold) {
        this.vocalPresent = false
      }
    }

    // 5) 噪声门 & 压缩映射（→ 0..1）
    let mouthTarget = 0
    if (this.vocalPresent && rmsDb > this.conf.gateDbfs) {
      const t = clamp01(
        (rmsDb - this.conf.inMinDbfs) /
          (this.conf.inMaxDbfs - this.conf.inMinDbfs)
      )
      // 曲线可用 sqrt 提高小音量敏感度
      mouthTarget = this.conf.outMin + (this.conf.outMax - this.conf.outMin) * Math.sqrt(t)
    } else {
      // 无人声：保持微动
      mouthTarget = 0.05
    }

    // 6) 攻击/释放平滑
    const attack = this.conf.attackMs / 1000
    const release = this.conf.releaseMs / 1000
    if (mouthTarget > this.mouthSmoothed) {
      // 攻击
      const a = 1 - Math.exp(-dt / Math.max(attack, 1e-4))
      this.mouthSmoothed += (mouthTarget - this.mouthSmoothed) * a
    } else {
      // 释放
      const r = 1 - Math.exp(-dt / Math.max(release, 1e-4))
      this.mouthSmoothed += (mouthTarget - this.mouthSmoothed) * r
    }

    // 7) 可选：根据“音高/能量重心”驱动 MouthForm
    const mouthForm = this.estimateMouthForm(this.specVocal, this.analyserVocal)

    // 8) 写入 Live2D
    this.setParam(this.conf.mouthOpenParam, clamp01(this.mouthSmoothed))
    if (this.conf.mouthFormParam) {
      this.setParam(this.conf.mouthFormParam, clamp01(mouthForm))
    }

    // 9) 输出节拍强度（低频能量做节拍动作）
    const beat = this.getBeatEnergy()

    return { mouthOpen: clamp01(this.mouthSmoothed), vocal: this.vocalPresent, beat }
  }

  // —— 工具函数们 ——
  private dbToLinArray(db: Float32Array): Float32Array {
    const out = new Float32Array(db.length)
    for (let i = 0; i < db.length; i++) out[i] = Math.pow(10, db[i] / 10)
    return out
  }

  private estimateMouthForm(specDb: Float32Array, analyser: AnalyserNode): number {
    // 用“谱重心”粗略区分高/低音：返回 0..1
    const lin = this.dbToLinArray(specDb)
    const sr = this.ctx.sampleRate
    const binHz = sr / analyser.fftSize
    let num = 0; let den = 0
    for (let i = 0; i < lin.length; i++) {
      const f = i * binHz
      num += f * lin[i]
      den += lin[i]
    }
    const centroid = den > 0 ? num / den : 0
    // 以 500Hz..3000Hz 做归一（高音→接近 1，低音→接近 0）
    const v = (centroid - 500) / (3000 - 500)
    return clamp01(v)
  }

  private getBeatEnergy(): number {
    const arr = new Float32Array(this.analyserBeat.frequencyBinCount)
    this.analyserBeat.getFloatFrequencyData(arr)
    // 取 30–120Hz 能量
    const sr = this.ctx.sampleRate
    const binHz = sr / this.analyserBeat.fftSize
    const low = Math.floor(30 / binHz)
    const high = Math.min(Math.floor(120 / binHz), arr.length - 1)
    let e = 0
    for (let i = low; i <= high; i++) {
      e += Math.pow(10, arr[i] / 10)
    }
    // 简单压缩映射
    return clamp01(Math.sqrt(e) * 3)
  }
}

function clamp01(x: number) { return Math.max(0, Math.min(1, x)) }

function sumArray(a: Float32Array) {
  let s = 0
  for (let i = 0; i < a.length; i++) s += a[i]
  return s
}

// 谱平坦度：几何均值/算术均值（0→强谐波，1→噪声/平）
function spectralFlatness(power: Float32Array): number {
  let geo = 0; let arith = 0; const n = power.length
  const eps = 1e-12
  for (let i = 0; i < n; i++) {
    const p = Math.max(power[i], eps)
    geo += Math.log(p)
    arith += p
  }
  geo = Math.exp(geo / n)
  arith = arith / n + eps
  return clamp01(geo / arith)
}
