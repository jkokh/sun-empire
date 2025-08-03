import { Button, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ProductModel } from '@tsed/prisma-models';
import { FunctionComponent } from 'react';

interface ProductActionsProps {
    product: ProductModel;
    onEdit: (product: ProductModel) => void;
    onDelete: (productId: number) => void;
}

export const ProductActions: FunctionComponent<ProductActionsProps> = ({ product, onEdit, onDelete }) => {
    return (
        <>
            <Button size="small" onClick={() => onEdit(product)} icon={<EditOutlined />} />&nbsp;
            <Popconfirm
                title="Are you sure you want to delete this product?"
                onConfirm={() => onDelete(product.id)}
                okText="Yes"
                cancelText="No"
            >
                <Button size="small" icon={<DeleteOutlined />} danger />
            </Popconfirm>
        </>
    );
};
