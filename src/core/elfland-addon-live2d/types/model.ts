import type { ElflandTheme } from '@/core/elfland-addon-theme'

type Id = string
type GroupId = string
type ParameterId = string

export interface ParameterData {
  id: Id
  parameterId: ParameterId
  value: number
  blend: 'Add' | 'Multiply'
  weight?: number
}

export interface ExpressionData {
  id: Id
  /** 想抹除某一个GroupId的参数设置为null */
  parameterDatas: Record<GroupId, Id | null>
}

export interface ModelConfig {
  name: string
  /**
   * Parameter组，每一组的Parameter一次只会激活一个
   */
  parameterGroups: { groupId: GroupId; parameterDatas: ParameterData[]}[]
  expressionDatas: ExpressionData[]
}
