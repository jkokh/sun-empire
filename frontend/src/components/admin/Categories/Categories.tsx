import { FunctionComponent, Key, useEffect, useState } from 'react';
import { Tree, Button } from 'antd';
import { getCategories } from '@/services/api.ts';
import { CategoryTreeNode } from './CategoryTreeNode.tsx';
import { buildTree, addNewNode, removeNode, updateTreeData } from '@/services/categoryService.ts';

import styles from './Categories.module.sass';
import { PlusOutlined } from '@ant-design/icons';
import { AddModal } from './AddModal.tsx';
import { DeleteModal } from './DeleteModal.tsx';
import { UpdateModal } from './UpdateModal.tsx';
import { TreeNode } from '@/types/categoryTypes.ts';

export const Categories: FunctionComponent = () => {
    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
    const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
    const [modalType, setModalType] = useState<'ADD' | 'DELETE' | 'UPDATE' | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await getCategories();
            setTreeData(buildTree(data));
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const openModal = (type: 'ADD' | 'DELETE' | 'UPDATE', node: TreeNode | null = null) => {
        setModalType(type);
        setSelectedNode(node);
    };

    const handleAddNode = (newNode: TreeNode) => {
        setTreeData(addNewNode(treeData, selectedNode?.key || null, newNode));
        setExpandedKeys(selectedNode ? [...expandedKeys, selectedNode.key] : [...expandedKeys, newNode.key]);
        setSelectedNode(newNode);
        closeModal();
    };

    const handleDeleteNode = () => {
        if (!selectedNode) return;
        setTreeData(removeNode(treeData, selectedNode.key));
        closeModal();
    };

    const handleUpdateNode = (updatedNode: TreeNode) => {
        setTreeData(updateTreeData(treeData, updatedNode.key, node => ({
            ...node,
            name: updatedNode.name,
            description: updatedNode.description,
        })));
        closeModal();
    };

    const closeModal = () => setModalType(null);

    const handleNodeClick = (key: number) => {
        setExpandedKeys(expandedKeys.includes(key) ? expandedKeys.filter(k => k !== key) : [...expandedKeys, key]);
    };

    return (
        <div>
            {modalType === 'ADD' && (
                <AddModal
                    open={true}
                    parentId={selectedNode?.id || null}
                    onClose={closeModal}
                    onAdd={handleAddNode}
                />
            )}
            {modalType === 'DELETE' && selectedNode && (
                <DeleteModal
                    open={true}
                    onClose={closeModal}
                    onDelete={handleDeleteNode}
                    node={selectedNode}
                />
            )}
            {modalType === 'UPDATE' && selectedNode && (
                <UpdateModal
                    open={true}
                    updatedNode={selectedNode}
                    onClose={closeModal}
                    onUpdate={handleUpdateNode}
                />
            )}

            <div className={styles.addRoot}>
                <Button icon={<PlusOutlined />} size="small" type="primary" onClick={() => openModal('ADD')}>
                    Add Root Category
                </Button>
            </div>

            <Tree
                treeData={treeData}
                expandedKeys={expandedKeys}
                onExpand={setExpandedKeys}
                selectedKeys={selectedNode ? [selectedNode.key] : []}
                onSelect={(_, { node }: { node: TreeNode }) => {
                    setSelectedNode(node);  // Set the selected node directly
                }}
                titleRender={nodeData => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CategoryTreeNode
                            data={nodeData}
                            onDoubleClick={() => handleNodeClick(nodeData.key)}
                            onAdd={() => openModal('ADD', nodeData)}
                            onDelete={() => openModal('DELETE', nodeData)}
                            onEdit={() => openModal('UPDATE', nodeData)}
                            selectedKey={selectedNode?.key ?? null}
                        />
                    </div>
                )}
            />
        </div>
    );
};
