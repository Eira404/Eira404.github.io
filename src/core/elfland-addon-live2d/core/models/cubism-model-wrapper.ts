import EventEmitter from 'eventemitter3'
import type { ExpressionManager } from 'pixi-live2d-display'
/**
 * live2D模型包装类
 */
export default class CubismModelWrapper extends EventEmitter {
  protected __cubismModel: any | null = null
  protected __expressionManager: ExpressionManager | null = null
  protected __destroyed: boolean = false

  protected setCubismModel(cubismModel: Object, expressionManager: ExpressionManager) {
    this.__cubismModel = cubismModel
    this.__expressionManager = expressionManager
  }
  protected pushExpressionData(expression: string) {
    if (!this.__expressionManager) return
    if (this.__expressionManager.getExpressionIndex(expression) !== -1) return
    this.__expressionManager.definitions.push({
      Name: expression,
      File: expression
    })
  }
  /**
	 * パラメータの値の加算(id)
	 * @param parameterId パラメータＩＤ
	 * @param value 加算する値
	 * @param weight 重み
	 */
  protected addParameterValueById(parameterId: string, value: number, weight?: number) {
    if (!this.__cubismModel) return
    this.__cubismModel.addParameterValueById(parameterId, value, weight)
  }
  /**
	 * パラメータの値の乗算
	 * @param parameterId パラメータのID
	 * @param value 乗算する値
	 * @param weight 重み
	 */
  protected multiplyParameterValueById(parameterId: string, value: number, weight?: number) {
    if (!this.__cubismModel) return
    this.__cubismModel.multiplyParameterValueById(parameterId, value, weight)
  }

  protected setParameterValueById(parameterId: string, value: number, weight?: number) {
    if (!this.__cubismModel) return
    this.__cubismModel.setParameterValueById(parameterId, value, weight)
  }

  protected getParameterIndex(parameterId: string): number {
    if (!this.__cubismModel) return -1
    return this.__cubismModel.getParameterIndex(parameterId) as number
  }

  protected getParameterValueById(parameterId: string): number {
    if (!this.__cubismModel) return -1
    return this.__cubismModel.getParameterValueById(parameterId) as number
  }

  protected saveParameters(): boolean {
    if (!this.__cubismModel) return false
    this.__cubismModel.saveParameters()
    return true
  }

  protected loadParameters(): boolean {
    if (!this.__cubismModel) return false
    this.__cubismModel.loadParameters()
    return true
  }

  destroy() {
    if (this.__destroyed) return
    this.__destroyed = true
    this.removeAllListeners()
  }
}
