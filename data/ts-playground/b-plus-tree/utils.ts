import { BPlusTreeLeafNode } from './leaf.ts'
import { BPlusTreeNode } from './node.ts'
import { BPlusTree } from './tree.ts'
import { BPlusTreeValueNode } from './value.ts'

export function print<V extends { id: string | number}>(tree: BPlusTree<V>) {
  const root = tree.root
  if (root === null) {
    console.log('Empty tree')
    return
  }
  let keysNums: number = root.keys.length
  let tempKeysNums: number = 0
  const keys: number[] = Array.from(root.keys)
  const values: (BPlusTreeNode<V> | BPlusTreeLeafNode<V>)[] | BPlusTreeValueNode<V>[] = Array.from(root.values as any) as (BPlusTreeNode<V> | BPlusTreeLeafNode<V>)[] | BPlusTreeValueNode<V>[]
  let tempConsole = ''
  console.log('<------------------- Tree Begin ------------------->')
  while (values.length > 0) {
    keysNums--
    const k = keys.shift()!
    const v = values.shift()!
    if (v instanceof BPlusTreeValueNode) {
      tempConsole += ` ${k} `
    } else {
      keys.push(...Array.from(v.keys))
      const vl = v.values
      values.push(...Array.from(vl as any) as any)
      tempKeysNums += v.keys.length
      tempConsole += ` ${k} -> ${JSON.stringify(v.keys)} `
    }
    if (keysNums === 0) {
      console.log(tempConsole)
      tempConsole = ''
      keysNums = tempKeysNums
      tempKeysNums = 0
    }
  }
  console.log('<------------------- Tree End ------------------->')
}

export function printLeaf<V extends { id: string | number}>(tree: BPlusTree<V>) {
  let leaf = tree.getFirstLeaf()
  let res = ''
  let t = 0
  while (leaf !== null && t++ < 20) {
    const keys = Array.from(leaf.keys)
    res += '< '
    keys.forEach((k, i) => {
      res += `${k} `
    })
    res += '> '
    leaf = leaf.next
  }
  console.log(res)
}
