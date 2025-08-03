import axios, { AxiosProgressEvent } from 'axios';
import { ProductModel, UserModel } from '@tsed/prisma-models';
import { TreeNode } from '@/types/categoryTypes.ts';
import { ImageUploadResponse, LoginData } from '../../../src/types';

const api = axios.create({
    baseURL: '/',
});

api.interceptors.request.use(
    (config: any): any => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const formatDecimal = (value: any): number => parseFloat(parseFloat(value.toString()).toFixed(2));

const processProductDecimals = (product: ProductModel): ProductModel => ({
    ...product,
    price: formatDecimal(product.price),
    discount: product.discount != null ? formatDecimal(product.discount) : null,
    weight: product.weight != null ? formatDecimal(product.weight) : null,
    shippingCost: product.shippingCost != null ? formatDecimal(product.shippingCost) : null,
});

export const registerUser = (userData: UserModel) => api.post('/api/users/register', userData);

export const loginUser = (loginData: LoginData) => api.post('/api/users/login', loginData);

export const requestResetPassword = (identifier: string, recaptcha: string) =>
    api.post('/api/users/request-reset-password', { identifier, recaptcha });

export const resetPassword = (password: string, token: string) => api.post('/api/users/reset-password', { password, token });

export const logoutUser = () => api.get('/api/users/logout');

export const keepAlive = () => api.get('/api/users/keep-alive');

export const getCategories = () => api.get('/api/cp/categories');

export const addProduct = async (product: ProductModel): Promise<ProductModel> => {
    const response = await api.post('/api/cp/products', product);
    return processProductDecimals(response.data);
};

export const updateProduct = async (product: ProductModel): Promise<ProductModel> => {
    const response = await api.put(`/api/cp/products/${product.id}`, product);
    return processProductDecimals(response.data);
};

export const getProducts = async (page: number, perPage: number): Promise<{ total: number; products: ProductModel[] }> => {
    const response = await api.get('/api/cp/products', { params: { page, perPage } });
    return {
        total: response.data.total,
        products: response.data.products.map(processProductDecimals),
    };
};

export const deleteProduct = (id: number) =>
    api.delete(`/api/cp/products/${id}`);

export const createCategory = async (categoryData: TreeNode): Promise<TreeNode> => {
    const response = await api.post('/api/cp/categories', categoryData);
    return response.data;
};

export const updateCategory = (id: number, categoryData: Partial<TreeNode>) =>
    api.put(`/api/cp/categories/${id}`, categoryData);

export const deleteCategory = (id: number) =>
    api.delete(`/api/cp/categories/${id}`);

export const uploadFile = async (
    file: File,
    onUploadProgress: (progressEvent: AxiosProgressEvent) => void
): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/cp/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
    });

    return response.data;
};

export const deleteFile = async (imageId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/api/cp/delete/${imageId}`);
    return response.data;
};