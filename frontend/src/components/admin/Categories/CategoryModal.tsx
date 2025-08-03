import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Input, Button, Form, InputRef } from 'antd';
import { GenericModal } from '../../GenericModal/GenericModal';
import styles from './Categories.module.sass';
import { errorNotification, successNotification } from '@/services/notification.ts';
import { createCategory, updateCategory, deleteCategory } from '@/services/api';
import { TreeNode } from '@/types/categoryTypes.ts'; // Import API requests here

interface CategoryModalProps {
    open: boolean;
    modalType: 'ADD' | 'DELETE' | 'UPDATE' | null;
    node: TreeNode | null;
    setNode: (node: TreeNode) => void;
    onClose: () => void;
    onAction: (newCategory: TreeNode) => void; // Optional prop to inform parent component of changes
}

export const CategoryModal: FunctionComponent<CategoryModalProps> = ({
                                                                         open,
                                                                         modalType,
                                                                         node,
                                                                         setNode,
                                                                         onClose,
                                                                         onAction,
                                                                     }) => {
    const [form] = Form.useForm();
    const inputRef = useRef<InputRef>(null);
    const [loading, setLoading] = useState(false);

    const titleLimit = 70;
    const descLimit = 200;

    useEffect(() => {
        if (open && (modalType === 'ADD' || modalType === 'UPDATE')) {
            const timer = setTimeout(() => inputRef.current?.focus(), 100);
            form.setFieldsValue({
                name: node?.name || '',
                description: node?.description || ''
            });
            return () => clearTimeout(timer);
        }
    }, [open, modalType]);

    const handleAsyncAction = async () => {
        if (!modalType || !node) return;

        setLoading(true);
        try {
            if (modalType === 'ADD') {
                await createCategory(node); // Call create API
                successNotification('Success', 'Category added successfully');
            } else if (modalType === 'UPDATE') {
                await updateCategory(node.key, node); // Call update API
                successNotification('Success', 'Category updated successfully');
            } else if (modalType === 'DELETE') {
                await deleteCategory(node.key); // Call delete API
                successNotification('Success', 'Category deleted successfully');
            }
            onAction(node);
            onClose();
        } catch (error) {
            errorNotification('Error', `Failed to ${modalType?.toLowerCase()} category.`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            await form.validateFields();
            await handleAsyncAction();
        } catch (errorInfo) {
            console.log('Validation Failed:', errorInfo);
        }
    };

    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNode({
            ...node,
            [field]: e.target.value,
            key: modalType === 'ADD' ? Date.now() : node?.key,
        } as TreeNode);
    };

    const renderButtons = (confirmText: string) => (
        <div className={styles.buttonGroup}>
            <Button onClick={onClose} className={styles.cancelButton} disabled={loading}>
                Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                {confirmText}
            </Button>
        </div>
    );

    const renderContent = () => {
        if (modalType === 'ADD' || modalType === 'UPDATE') {
            const placeholderTitle = modalType === 'ADD' ? 'Enter category name' : 'Enter updated category name';
            const placeholderDescription = modalType === 'ADD' ? 'Enter category description' : 'Enter updated category description';
            const confirmText = modalType === 'ADD' ? 'Add' : 'Confirm';

            return (
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="name"
                        rules={[
                            { required: true, message: 'Please enter the category name' },
                            { max: titleLimit, message: `Title cannot exceed ${titleLimit} characters` },
                        ]}
                    >
                        <Input
                            ref={inputRef}
                            placeholder={placeholderTitle}
                            maxLength={titleLimit}
                            onChange={handleInputChange('name')}
                        />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        rules={[
                            { message: 'Please enter the category description' },
                            { max: descLimit, message: `Description cannot exceed ${descLimit} characters` },
                        ]}
                    >
                        <Input.TextArea
                            placeholder={placeholderDescription}
                            maxLength={descLimit}
                            onChange={handleInputChange('description')}
                        />
                    </Form.Item>
                    {renderButtons(confirmText)}
                </Form>
            );
        }

        if (modalType === 'DELETE') {
            return (
                <div>
                    <p>Are you sure you want to delete the category "{node?.name}"?</p>
                    <div className={styles.buttonGroup}>
                        <Button onClick={onClose} className={styles.cancelButton} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="primary" onClick={handleAsyncAction} loading={loading} disabled={loading}>
                            Confirm
                        </Button>
                    </div>
                </div>
            );
        }

        return null;
    };

    const renderTitle = () => {
        switch (modalType) {
            case 'ADD':
                return 'Add Category';
            case 'DELETE':
                return 'Delete Category';
            case 'UPDATE':
                return 'Update Category';
            default:
                return '';
        }
    };

    return (
        <GenericModal open={open} title={renderTitle()} content={renderContent()} onClose={onClose} />
    );
};
