import { FunctionComponent } from 'react';
import { Table, TablePaginationConfig } from 'antd';
import { ColumnType } from 'antd/es/table';
import { ProductModel } from '@tsed/prisma-models';

interface ProductTableProps {
    products: ProductModel[];
    columns: ColumnType<ProductModel>[];
    loading: boolean;
    currentPage: number;
    pageSize: number;
    total: number;
    onChange: (pagination: TablePaginationConfig) => void;
    rowClassName?: (record: ProductModel) => string; // Function to determine class name
}

export const ProductTable: FunctionComponent<ProductTableProps> = ({
                                                                       products,
                                                                       columns,
                                                                       loading,
                                                                       currentPage = 1,
                                                                       pageSize = 10,
                                                                       total,
                                                                       onChange,
                                                                       rowClassName, // Pass the row class name logic
                                                                   }) => (
    <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        pagination={{
            current: currentPage,
            pageSize,
            total,
            showSizeChanger: true,
        }}
        loading={loading}
        onChange={onChange}
        rowClassName={(record) => rowClassName ? rowClassName(record) : ''} // Apply row class dynamically
    />
);
