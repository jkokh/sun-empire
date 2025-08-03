import { FunctionComponent } from 'react';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './Categories.module.sass';

interface TreeNodeActionsProps {
    onEdit: () => void;
    onAdd: () => void;
    onDelete: () => void;
}

export const TreeNodeActions: FunctionComponent<TreeNodeActionsProps> = ({
                                                                             onEdit,
                                                                             onAdd,
                                                                             onDelete,
                                                                         }) => (
    <div className={styles.treeNodeActions}>
        <EditOutlined onClick={onEdit} />
        <PlusOutlined onClick={onAdd} />
        <DeleteOutlined onClick={onDelete} />
    </div>
);
