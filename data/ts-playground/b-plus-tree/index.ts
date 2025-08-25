import { print, printLeaf } from './utils.ts'
import { BPlusTree } from './tree.ts'

type item = {
  id: number
  value: string
}

const tree = new BPlusTree<item>(3)
// 5,6,4,8,7,10,36,16
tree.insert(5, { id: 5, value: '5' })
tree.insert(6, { id: 6, value: '6' })
tree.insert(4, { id: 4, value: '4' })
tree.insert(8, { id: 8, value: '8' })
tree.insert(7, { id: 7, value: '7' })
tree.insert(10, { id: 10, value: '10' })
tree.insert(36, { id: 36, value: '36' })
tree.insert(16, { id: 16, value: '16' })
// console.log(tree)
print(tree)
printLeaf(tree)
