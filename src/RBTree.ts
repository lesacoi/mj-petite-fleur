import createRBTree from "functional-red-black-tree";
export type RBTree<K, V> = createRBTree.Tree<K, V>;
export { createRBTree };
