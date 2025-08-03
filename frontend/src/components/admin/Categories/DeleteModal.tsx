import { FunctionComponent, useState } from 'react';
import { Button } from 'antd';
import { GenericModal } from '../../GenericModal/GenericModal';
import styles from './Categories.module.sass';
import { errorNotification, successNotification } from '@/services/notification.ts';
import { deleteCategory } from '@/services/api';
import { TreeNode } from '@/types/categoryTypes.ts';

interface CategoryModalProps {
    open: boolean;
    node: TreeNode;
    onDelete: () => void;
    onClose: () => void;
}

export const DeleteModal: FunctionComponent<CategoryModalProps> = ({
                                                                         open,
                                                                         node,
                                                                         onDelete,
                                                                         onClose,
                                                                     }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteCategory(node.id);
            successNotification('Success', 'Category deleted successfully');
            onDelete();
        } catch (error) {
            errorNotification('Error', 'Failed to delete category.');
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => (
        <div>
            <p>Are you sure you want to delete the category "{node?.name}"?</p>
            <div className={styles.buttonGroup}>
                <Button onClick={onClose} className={styles.cancelButton} disabled={loading}>
                    Cancel
                </Button>
                <Button type="primary" onClick={handleDelete} loading={loading} disabled={loading}>
                    Confirm
                </Button>
            </div>
        </div>
    );

    return (
        <GenericModal open={open} title="Delete Category" content={renderContent()} onClose={onClose} />
    );
};
