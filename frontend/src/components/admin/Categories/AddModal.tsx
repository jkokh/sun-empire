import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Input, Button, Form, InputRef } from 'antd';
import { GenericModal } from '../../GenericModal/GenericModal';
import styles from './Categories.module.sass';
import { errorNotification, successNotification } from '@/services/notification.ts';
import { TreeNode } from '@/types/categoryTypes.ts';
import { createCategory } from '@/services/api.ts';

interface CategoryModalProps {
    open: boolean;
    parentId: number | null;
    onClose: () => void;
    onAdd: (newCategory: TreeNode) => void;
}

export const AddModal: FunctionComponent<CategoryModalProps> = ({
                                                                    open,
                                                                    parentId,
                                                                    onClose,
                                                                    onAdd,
                                                                }) => {
    const [form] = Form.useForm();
    const inputRef = useRef<InputRef>(null);
    const [loading, setLoading] = useState(false);
    const [node, setNode] = useState<TreeNode | null>(null);

    const titleLimit = 70;
    const descLimit = 200;

    useEffect(() => {
        if (open) {
            form.setFieldsValue({ name: '', description: '' });
            const key = Date.now();
            setNode({ name: '', description: '', key, id: key, parentId, children: [] });
            const timer = setTimeout(() => inputRef.current?.focus(), 100);
            return () => clearTimeout(timer);
        }
    }, [form, open, parentId]);

    const handleSubmit = async () => {
        if (!node) return;
        try {
            await form.validateFields();
            setLoading(true);
            const addedNode = await createCategory(node);
            successNotification('Success', 'Category added successfully');
            onAdd({ ...node, ...addedNode });
        } catch (error) {
            errorNotification('Error', error instanceof Error ? error.message : 'Failed to add category.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNode({ ...node, [field]: e.target.value } as TreeNode);
    };

    const renderContent = (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
                name="name"
                rules={[
                    { required: true, message: 'Please enter the category name' },
                    { max: titleLimit, message: `Name cannot exceed ${titleLimit} characters` },
                ]}
            >
                <Input
                    ref={inputRef}
                    placeholder="Enter category name"
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
                    placeholder="Enter category description"
                    maxLength={descLimit}
                    onChange={handleInputChange('description')}
                />
            </Form.Item>
            <div className={styles.buttonGroup}>
                <Button onClick={onClose} className={styles.cancelButton} disabled={loading}>
                    Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                    Add!
                </Button>
            </div>
        </Form>
    );

    return (
        <GenericModal open={open} title="Add Category" content={renderContent} onClose={onClose} />
    );
};
