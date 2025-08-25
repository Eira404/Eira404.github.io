export type ElementSelector = string
export type MessageReceived = string | string[] | (string | { msg: string, i18n: boolean})[]
export type ElementAttribute = null | string | string[]
export enum UseI18nFor {
  N = 'NoUseI18n',
  M = 'UseI18nForMessage',
  D = 'UseI18nForDollar',
  B = 'UseI18nForBoth'
}
export type MessageDetails =
  | RegExp
  | ((value: null | string | string[], element: Element) => Array<string> | string | false | { msg: string | string[], i18n?: UseI18nFor})
/**
 * 每一行信息
 * 1. 元素选择方式
 * 2. 事件触发后回传的信息
 * 3. element的attr
 *    1. 查询element中的attr：Element.getAttribute(attr)
 *    2. 存在正则表达式或处理函数，则对其传入此值
 * 4. 哪些字符串使用i18n的情况
 * 5. 正则表达式或者处理函数
 *    1. 函数情况
 *        1. 数组：按照数组下标查询字符串中的'$i'，找到之后替换
 *        2. 字符串：如果只有$0时，可以省略直接返回一个字符串
 *        3. false：不触发信息
 *        4. { msg: string | string[], i18n?: UseI18nFor} 重写信息，msg全部都被认为是Message，i18n用来覆盖原有的信息，
 *    2. 正则表达式
 *        1. 调用regexp.exec(Element.getAttribute(attr))
 *        2. 按照返回的数组下标查询字符串中的'$i'，找到之后替换
 *    3. elemnet的attr不为string时，此值无效
 */
export type MessageRow = [ElementSelector, MessageReceived, ElementAttribute, UseI18nFor, MessageDetails]
export type MessageDictHTML = {
  [K in keyof HTMLElementEventMap]?: Array<MessageRow>
}
export interface MessageDict {
  html: MessageDictHTML
}
