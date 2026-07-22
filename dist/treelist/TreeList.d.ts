import TreeNode from "./TreeNode";
export type IFindParents<T = any> = (value: T, candidates: Array<T>) => Array<T>;
type IParentNode<T> = TreeNode<T> | null;
export declare class TreeList<T = any> extends Array<TreeNode<T>> {
    roots: Array<TreeNode<T>>;
    constructor(collection?: Array<T>);
    static get [Symbol.species](): ArrayConstructor;
    init(values?: Array<T>, findParents?: IFindParents<T>): TreeList<T>;
    addValue(value: T, parentNode?: IParentNode<T>): TreeNode<T>;
    addValues(values: Array<T>, parentNode?: IParentNode<T>): Array<TreeNode<T>>;
    remove(node: TreeNode<T>): boolean;
    move(node: TreeNode<T>, parent?: TreeNode<T> | null): void;
    /**
     * Retrieves all TreeNodes for the given value(s)
     * @param {any} values (default undefined so we can treat null as a valid value)
     * @returns {Array<TreeNode>} collection of TreeNodes
     */
    getNodes(input?: T | Array<T>): Array<TreeNode<T>>;
    /**
     * Retrieves all roots for the given TreeNode(s)
     * @param {Array<TreeNode>|TreeNode} nodes
     * @returns {Array<TreeNode>} collection of TreeNodes
     */
    getRoots(nodes?: TreeNode<T> | Array<TreeNode<T>>): Array<TreeNode<T>>;
    /**
     * Retrieves all parents and their parents for the given TreeNode(s)
     * @param {Array<TreeNode>|TreeNode} nodes (or values)
     * @returns {Array<TreeNode>} collection of TreeNodes
     */
    getAncestors(nodes?: TreeNode<T> | Array<TreeNode<T>>): Array<TreeNode<T>>;
    /**
     * Retrieves all children and their children for the given TreeNode(s)
     * @param {Array<TreeNode>|TreeNode} nodes
     * @returns {Array<TreeNode>} collection of TreeNodes
     */
    getOffspring(nodes?: TreeNode<T> | Array<TreeNode<T>>): Array<TreeNode<T>>;
    /**
     * Retrieves all (distinct) values from this TreeList
     * @returns {Array<Object>} collection of values
     */
    getValues(nodes?: TreeNode<T> | Array<TreeNode<T>>): Array<T>;
    _ensureNodeList(nodes?: TreeNode<T> | Array<TreeNode<T>>): Array<TreeNode<T>>;
}
export default TreeList;
