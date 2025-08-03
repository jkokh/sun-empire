import { Category, TreeNode } from '../types/categoryTypes.ts';

export const buildTree = (categories: Category[], parentId: number | null = null): TreeNode[] => {
    return categories
        .filter(category => category.parentId === parentId)
        .map(category => ({
            name: category.name,
            description: category.description,
            key: category.id,
            id: category.id,
            parentId: category.parentId,
            children: buildTree(categories, category.id),
        }));
};

export const updateTreeData = (
    data: TreeNode[],
    key: number,
    callback: (node: TreeNode) => TreeNode
): TreeNode[] => {
    return data.map(node =>
        node.key === key
            ? callback(node)
            : node.children
                ? { ...node, children: updateTreeData(node.children, key, callback) }
                : node
    );
};

export const addNewNode = (
    data: TreeNode[],
    parentKey: number | null,
    newNode: TreeNode
): TreeNode[] => {
    if (parentKey === null) {
        return [...data, newNode];
    }
    return data.map(node => {
        if (node.key === parentKey) {
            return { ...node, children: [...(node.children || []), newNode] };
        }
        if (node.children) {
            return { ...node, children: addNewNode(node.children, parentKey, newNode) };
        }
        return node;
    });
};

export const removeNode = (data: TreeNode[], key: number): TreeNode[] => {
    return data
        .filter(node => node.key !== key)
        .map(node => ({
            ...node,
            children: removeNode(node.children || [], key),
        }));
};