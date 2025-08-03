import { FunctionComponent } from 'react';
import { TreeNodeActions } from './TreeNodeActions';
import { TreeNode } from '@/types/categoryTypes.ts';

interface TreeNodeProps {
    data: TreeNode;
    onDoubleClick: () => void;
    onEdit: () => void;
    onAdd: () => void;
    onDelete: () => void;
    selectedKey: number | null;
}

export const CategoryTreeNode: FunctionComponent<TreeNodeProps> = ({
       data,
       onDoubleClick,
       onEdit,
       onAdd,
       onDelete,
       selectedKey,
   }) => {

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span onDoubleClick={onDoubleClick}>{data.name}</span>
            {selectedKey === data.key && (
                <TreeNodeActions
                    onEdit={onEdit}
                    onAdd={onAdd}
                    onDelete={onDelete}
                />
            )}
        </div>
    );
};
