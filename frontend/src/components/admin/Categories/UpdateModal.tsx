import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Input, Button, Form, InputRef } from 'antd';
import { GenericModal } from '../../GenericModal/GenericModal';
import styles from './Categories.module.sass';
import { errorNotification, successNotification } from '@/services/notification.ts';
import { updateCategory } from '@/services/api';
import { TreeNode } from '@/types/categoryTypes.ts';

interface CategoryModalProps {
    open: boolean;
    updatedNode: TreeNode;
    onClose: () => void;
    onUpdate: (updatedCategory: TreeNode) => void;
}

export const UpdateModal: FunctionComponent<CategoryModalProps> = ({
                                                                         open,
                                                                         updatedNode,
                                                                         onUpdate,
                                                                         onClose,
                                                                     }) => {
    const [form] = Form.useForm();
    const inputRef = useRef<InputRef>(null);
    const [loading, setLoading] = useState(false);
    const [node, setNode] = useState<TreeNode | null>(null);

    const titleLimit = 70;
    const descLimit = 200;

    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => inputRef.current?.focus(), 100);
            form.setFieldsValue({
                name: updatedNode.name,
                description: updatedNode.description,
            });
            return () => clearTimeout(timer);
        }
    }, [form, open, updatedNode.description, updatedNode.name]);

    const handleUpdateCategory = async () => {
        if (!node) return;
        setLoading(true);
        try {
            await updateCategory(node.id, node);
            successNotification('Success', 'Category updated successfully');
            onUpdate(node);
            onClose();
        } catch (error) {
            errorNotification('Error', 'Failed to update category.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            await form.validateFields();
            await handleUpdateCategory();
        } catch (errorInfo) {
            console.log('Validation Failed:', errorInfo);
        }
    };

    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNode({ ...updatedNode, [field]: e.target.value } as TreeNode);
    };

    const renderContent = () => (
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
                    placeholder="Enter updated category name"
                    maxLength={titleLimit}
                    onChange={handleInputChange('name')}
                />
            </Form.Item>
            <Form.Item
                name="description"
                rules={[
                    { max: descLimit, message: `Description cannot exceed ${descLimit} characters` },
                ]}
            >
                <Input.TextArea
                    placeholder="Enter updated category description"
                    maxLength={descLimit}
                    onChange={handleInputChange('description')}
                />
            </Form.Item>
            <div className={styles.buttonGroup}>
                <Button onClick={onClose} className={styles.cancelButton} disabled={loading}>
                    Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                    Confirm
                </Button>
            </div>
        </Form>
    );

    return (
        <GenericModal open={open} title="Update Category" content={renderContent()} onClose={onClose} />
    );
};
