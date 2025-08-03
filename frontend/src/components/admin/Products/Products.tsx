import { FunctionComponent, useEffect, useState, useCallback } from 'react';
import { Button, TablePaginationConfig } from 'antd';
import { addProduct, deleteProduct, getProducts, updateProduct } from '@/services/api';
import { GenericModal } from '@/components/GenericModal/GenericModal';
import { ProductForm } from './ProductForm.tsx';
import { ProductTable } from './ProductTable';
import { ProductModel, CategoryModel } from '@tsed/prisma-models';
import { errorNotification } from '@/services/notification.ts';
import styles from './Products.module.sass';
import { ProductActions } from '@/components/admin/Products/ProductActions.tsx';
import { ProductCategories } from '@/components/admin/Products/ProductCategories.tsx';

export const Products: FunctionComponent = () => {
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductModel | undefined>();
    const [highlightedProductIds, setHighlightedProductIds] = useState<number[]>([]);

    const fetchProducts = useCallback(async (page: number, pageSize: number) => {
        setLoading(true);
        try {
            const { products, total } = await getProducts(page, pageSize);
            setProducts(products);
            setTotal(total);
        } catch (error) {
            errorNotification('Error', 'Error fetching products.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts(currentPage, pageSize);
    }, [fetchProducts, currentPage, pageSize]);

    const handleTableChange = (pagination: TablePaginationConfig) => {
        setCurrentPage(pagination.current || 1);
        setPageSize(pagination.pageSize || 10);
    };

    const openModal = (product?: ProductModel) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(undefined);
    };

    const handleProductSubmit = async (product: ProductModel) => {
        setLoading(true);
        const action = selectedProduct ? updateProduct : addProduct;
        try {
            const updatedProduct = await action(product);
            setProducts((prevProducts) =>
                selectedProduct
                    ? prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
                    : [updatedProduct, ...prevProducts]
            );
            setHighlightedProductIds((prevIds) => [...prevIds, updatedProduct.id]);
            setTotal((prevTotal) => (selectedProduct ? prevTotal : prevTotal + 1));
            closeModal();
        } catch (error) {
            errorNotification('Error', `Failed to ${selectedProduct ? 'update' : 'add'} product.`);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId: number) => {
        setLoading(true);
        try {
            await deleteProduct(productId);
            setProducts((prevProducts) => prevProducts.filter(p => p.id !== productId));
            setTotal((prevTotal) => prevTotal - 1);
        } catch (error) {
            errorNotification('Error', 'Failed to delete product.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', className: styles.singleLine },
        { title: 'Description', dataIndex: 'description', className: styles.singleLine },
        { title: 'Price', dataIndex: 'price' },
        { title: 'Stock', dataIndex: 'stock' },
        { title: 'Discount', dataIndex: 'discount' },
        {
            title: 'Categories',
            dataIndex: 'categories',
            render: (categories: CategoryModel[]) => <ProductCategories categories={categories} />,
        },
        {
            title: 'Actions',
            render: (product: ProductModel) => (
                <ProductActions
                    product={product}
                    onEdit={openModal}
                    onDelete={handleDelete}
                />
            ),
        },
    ];

    const getRowClassName = (record: ProductModel) =>
        highlightedProductIds.includes(record.id) ? styles.highlight : '';

    return (
        <div>
            <Button
                type="primary"
                onClick={() => openModal()}
                style={{ marginBottom: 16 }}
            >
                Add Product
            </Button>
            <ProductTable
                products={products}
                columns={columns}
                loading={loading}
                currentPage={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handleTableChange}
                rowClassName={getRowClassName}
            />
            <GenericModal
                open={isModalOpen}
                title={selectedProduct ? 'Edit Product' : 'Add New Product'}
                content={<ProductForm onFinish={handleProductSubmit} product={selectedProduct} />}
                onClose={closeModal}
            />
        </div>
    );
};