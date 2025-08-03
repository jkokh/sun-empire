import { DataNode } from 'antd/es/tree';

export interface Category {
    id: number;
    name: string;
    description?:  string;
    parentId: number | null;
    children?: Category[];
}

export interface TreeNode extends DataNode {
    id: number;
    name: string;
    parentId: number | null;
    description?: string;
    key: number;
    children?: TreeNode[];
}
