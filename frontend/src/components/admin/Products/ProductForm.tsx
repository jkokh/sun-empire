import { FunctionComponent, useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, TreeSelect, FormRule, Row, Col } from 'antd';
import { ProductModel } from '@tsed/prisma-models';
import { useFormSubmit } from '@/hooks/useFormSubmit.ts';
import { getCategories } from '@/services/api.ts';
import { TreeNode } from '@/types/categoryTypes.ts';
import { buildTree } from '@/services/categoryService.ts';
import ImageUploader from '../ImageUploader/ImageUploader.tsx';

interface AddProductFormProps {
    onFinish: (values: ProductModel) => Promise<void>;
    product?: ProductModel;
}

export const ProductForm: FunctionComponent<AddProductFormProps> = ({ onFinish, product }) => {
    const [form] = Form.useForm();
    const [categoryTree, setCategoryTree] = useState<TreeNode[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>(product?.categories?.map(x => x.id) || []);
    const [debugInfo, setDebugInfo] = useState<string>('');

    const { onSubmit, loading } = useFormSubmit<ProductModel>(
        form,
        (values) => {
            const submissionData = { ...values, id: product?.id };
            return onFinish(submissionData as ProductModel);
        },
        { message: product ? 'Updated' : 'Added', description: `Product ${product ? 'updated' : 'added'} successfully` }
    );

    useEffect(() => {
        if (product) {
            form.setFieldsValue({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                discount: product.discount,
                categoryIds: product.categories?.map(x => x.id),
                images: product.images,
            });
            setSelectedCategories(product.categories?.map(x => x.id) || []);
        }
    }, [product, form]);

    useEffect(() => {
        async function fetchCategories() {
            const { data } = await getCategories();
            const treeData = buildTree(data);
            setCategoryTree(treeData);
        }
        fetchCategories();
    }, []);

    useEffect(() => {
        setDebugInfo(JSON.stringify(form.getFieldsValue(), null, 4));
    }, [form.getFieldsValue(), form]);

    const validationRules: { [key: string]: FormRule[] } = {
        name: [
            { required: true, message: 'Please enter the product name' },
            { max: 50, message: 'Max length is 50' },
        ],
        description: [
            { required: true, message: 'Please enter description' },
            { max: 1000, message: 'Max length is 1000' },
        ],
        price: [
            { required: true, message: 'Please enter the product price' },
            { type: 'number', min: 0, message: 'Price must be a positive number' },
        ],
        stock: [
            { required: true, message: 'Please enter the stock quantity' },
            { type: 'number', min: 0, message: 'Stock must be a positive number' },
        ],
        discount: [
            { type: 'number', min: 0, max: 100, message: 'Discount must be between 0 and 100' },
        ],
    };

    const onCategoryChange = (value: number[]) => setSelectedCategories(value);

    return (
        <Form form={form} layout="vertical" onFinish={onSubmit}>
            <Row gutter={16}>
                <Col span={14}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item name="name" label="Name" rules={validationRules.name}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="description" label="Description" rules={validationRules.description}>
                                <Input.TextArea />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="price" label="Price" rules={validationRules.price}>
                                <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="stock" label="Stock" rules={validationRules.stock}>
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="discount" label="Discount (%)" rules={validationRules.discount}>
                                <InputNumber min={0} max={100} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            {categoryTree.length > 0 && (
                                <Form.Item name="categoryIds" label="Category" rules={[{ required: true, message: 'Please select a category' }]}>
                                    <TreeSelect
                                        treeData={categoryTree}
                                        value={selectedCategories}
                                        onChange={onCategoryChange}
                                        placeholder="Please select a category"
                                        treeCheckable={true}
                                        showCheckedStrategy={TreeSelect.SHOW_PARENT}
                                        treeDefaultExpandAll
                                        fieldNames={{ label: 'name', value: 'id' }}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    {product ? 'Update Product' : 'Add Product'}
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col span={10}>
                    <Form.Item name="images" label="Images" labelCol={{ span: 24 }}>
                        <ImageUploader value={product!.images as any} onChange={(images) => {
                            //form.setFieldsValue({ images });
                            //setDebugInfo(JSON.stringify(form.getFieldsValue(), null, 4));
                        }} />
                    </Form.Item>
                </Col>
            </Row>
            <pre>{debugInfo}</pre>
        </Form>
    );
};