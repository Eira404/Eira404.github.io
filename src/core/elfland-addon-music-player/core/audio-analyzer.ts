export type Spectrum = {
  /** 每个频率 bin 的分贝值（dB），长度为 analyser.frequencyBinCount */
  db: Float32Array;
  /** 对应频率轴（Hz），长度同上 */
  freqHz: Float32Array;
};

export type Waveform = {
  /** 归一化波形（-1..1） */
  samples: Float32Array;
  /** 该批样本覆盖的时长（秒） */
  durationSec: number;
};

export type Loudness = {
  /** 瞬时 RMS，以 dBFS 表示（0 dBFS 为满刻度，常为负值） */
  rmsDbfs: number;
  /** 瞬时 Peak（线性幅度，0..1） */
  peak: number;
  /** 近似 K 加权短时 LUFS（未做门限/积分，≈ dBFS + 2.3） */
  lufsApprox: number;
};

export type AudioAnalyzerOptions = {
  /** 传入已有 <audio> 元素（可选）；若不传，会内部创建一个 */
  element?: HTMLAudioElement;
  /** 音频地址（可选；若传 element 则可不填） */
  src?: string;
  /** 频谱分析的 FFT 大小（必须是 32 的幂；默认 4096） */
  fftSize?: number;
  /** 频谱平滑系数（0..1；默认 0.8） */
  smoothingTimeConstant?: number;
  /** 近似 LUFS 的窗口（通过更大的 fftSize 接近 400ms；默认 16384） */
  kFftSize?: number;
  /** 是否将 <audio> 连接到扬声器（默认 true） */
  monitorOutput?: boolean;
  /** <audio> 的跨域策略（若加载跨域音频建议为 "anonymous"） */
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
  /** 初始音量（0..1，默认 1） */
  volume?: number;
};

export class AudioAnalyzer {
  readonly audio: HTMLAudioElement
  readonly ctx: AudioContext
  private srcNode: MediaElementAudioSourceNode
  private analyser: AnalyserNode
  private kAnalyser: AnalyserNode

  private hp: BiquadFilterNode
  private hs: BiquadFilterNode

  private freqDb: Float32Array
  private timeBuf: Float32Array
  private kTimeBuf: Float32Array
  private freqHz: Float32Array

  get src() {
    return this.srcNode
  }

  constructor(opts: AudioAnalyzerOptions = {}) {
    const {
      element,
      src,
      fftSize = 4096,
      kFftSize = 16384,
      smoothingTimeConstant = 0.8,
      monitorOutput = true,
      crossOrigin = 'anonymous',
      volume = 1
    } = opts

    // 1) audio 元素 & 播放基础
    this.audio = element ?? document.createElement('audio')
    this.audio.preload = 'auto'
    this.audio.loop = false
    this.audio.controls = false
    this.audio.volume = volume
    if (!element && src) {
      if (crossOrigin) this.audio.crossOrigin = crossOrigin
      this.audio.src = src
    } else if (!element && !src) {
      throw new Error('Provide either opts.element or opts.src')
    }

    // 2) WebAudio 图
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()

    this.srcNode = this.ctx.createMediaElementSource(this.audio)

    // 主分析器（频谱+波形）
    this.analyser = this.ctx.createAnalyser()
    this.analyser.fftSize = fftSize
    this.analyser.smoothingTimeConstant = smoothingTimeConstant

    // K 加权链：60Hz 高通 + 4kHz 高架，接专用 analyser 做“近似 LUFS”
    this.hp = this.ctx.createBiquadFilter()
    this.hp.type = 'highpass'
    this.hp.frequency.value = 60  // 近似 BS.1770 的 60Hz 高通
    this.hp.Q.value = 0.5

    this.hs = this.ctx.createBiquadFilter()
    this.hs.type = 'highshelf'
    this.hs.frequency.value = 4000  // 4kHz 起的高架
    this.hs.gain.value = 4          // +4 dB

    this.kAnalyser = this.ctx.createAnalyser()
    this.kAnalyser.fftSize = kFftSize // ≈ 16384/48k ≈ 341ms 的窗口
    this.kAnalyser.smoothingTimeConstant = 0

    // 连接：源 -> [主 analyser] + （K 链 -> kAnalyser）
    this.srcNode.connect(this.analyser)
    this.srcNode.connect(this.hp)
    this.hp.connect(this.hs)
    this.hs.connect(this.kAnalyser)

    // 是否输出到扬声器
    if (monitorOutput) {
      this.srcNode.connect(this.ctx.destination)
    }

    // 3) 缓冲区
    this.freqDb = new Float32Array(this.analyser.frequencyBinCount)
    this.timeBuf = new Float32Array(this.analyser.fftSize)
    this.kTimeBuf = new Float32Array(this.kAnalyser.fftSize)

    // 频率轴（Hz）
    const n = this.analyser.frequencyBinCount
    const sr = this.ctx.sampleRate
    const freqAxis = new Float32Array(n)
    const binHz = sr / this.analyser.fftSize
    for (let i = 0; i < n; i++) freqAxis[i] = i * binHz
    this.freqHz = freqAxis
  }

  /** 兼容自动播放策略：在用户手势后调用 */
  async resume() {
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume()
    }
  }

  async load(src: string) {
    if (this.audio.src !== src) this.audio.src = src
    await this.audio.load()
  }

  async play() {
    await this.resume()
    await this.audio.play()
  }

  pause() {
    this.audio.pause()
  }

  setVolume(v: number) {
    this.audio.volume = Math.max(0, Math.min(1, v))
  }

  /** 频谱（dB）+ 频率轴（Hz） */
  getSpectrum(): Spectrum {
    this.analyser.getFloatFrequencyData(this.freqDb as Float32Array<ArrayBuffer>) // dB 值（负数为主）
    return { db: this.freqDb, freqHz: this.freqHz }
    // 如需线性幅度：amp = 10^(db/20)
  }

  /** 波形（时域样本；-1..1）及时长 */
  getWaveform(): Waveform {
    this.analyser.getFloatTimeDomainData(this.timeBuf as Float32Array<ArrayBuffer>)
    return {
      samples: this.timeBuf,
      durationSec: this.timeBuf.length / this.ctx.sampleRate
    }
  }

  /** 响度：RMS(dBFS) + Peak(线性) + 近似短时 LUFS（K 加权，无门限） */
  getLoudness(): Loudness {
    // 1) 基本 RMS/Peak（对原始时域）
    this.analyser.getFloatTimeDomainData(this.timeBuf as Float32Array<ArrayBuffer>)
    let sum = 0; let peak = 0
    for (let i = 0; i < this.timeBuf.length; i++) {
      const x = this.timeBuf[i]
      sum += x * x
      const ax = Math.abs(x)
      if (ax > peak) peak = ax
    }
    const rms = Math.sqrt(sum / this.timeBuf.length)
    const rmsDbfs = 20 * Math.log10(Math.max(rms, 1e-12)) // dBFS

    // 2) K 加权后再算 RMS（近似 LUFS：dBFS + 2.3）
    this.kAnalyser.getFloatTimeDomainData(this.kTimeBuf as Float32Array<ArrayBuffer>)
    let ksum = 0
    for (let i = 0; i < this.kTimeBuf.length; i++) {
      const x = this.kTimeBuf[i]
      ksum += x * x
    }
    const krms = Math.sqrt(ksum / this.kTimeBuf.length)
    const kDbfs = 20 * Math.log10(Math.max(krms, 1e-12))
    const lufsApprox = kDbfs + 2.3 // 经验近似：满刻度正弦 ≈ -0.691 LUFS

    return { rmsDbfs, peak, lufsApprox }
  }

  /** 清理 */
  destroy() {
    try {
      this.srcNode.disconnect()
      this.analyser.disconnect()
      this.hp.disconnect()
      this.hs.disconnect()
      this.kAnalyser.disconnect()
    } catch (e) {
      console.error(e)
    }
    try {
      if (this.ctx.state !== 'closed') this.ctx.close()
    } catch (e) {
      console.error(e)
    }
  }
}
