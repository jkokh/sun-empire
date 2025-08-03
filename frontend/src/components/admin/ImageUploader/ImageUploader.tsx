import { FunctionComponent, useEffect, useState } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import styles from './ImageUploader.module.sass';
import { useImageUploader } from './useImageUploader';
import ImageUploaderItem from './ImageUploaderItem';
import { ImageUploaderProps, ValidatedFile } from '@/components/admin/ImageUploader/ImageUploaderTypes';
import { uploadFile } from '@/services/api.ts';
import { AxiosProgressEvent } from 'axios';

const ImageUploader: FunctionComponent<ImageUploaderProps> = ({ value = [], onChange }) => {
    const {
        imageList,
        handleFileUpload: handleUpload,
        handleChange,
        handleRemove,
        handleDescriptionChange,
        handleDragEnd,
    } = useImageUploader(value, onChange);

    const [fileList, setFileList] = useState<ValidatedFile[]>([]);

    useEffect(() => {
        setFileList(value.map(file => ({
            ...file,
            status: 'done'
        })));
    }, [value]);

    const customUpload = async (options: any) => {
        const { file, onProgress, onSuccess, onError } = options;
        try {
            const result = await uploadFile(file, (progressEvent: AxiosProgressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
                setFileList((prevList) =>
                    prevList.map((item) =>
                        item.uid === file.uid ? { ...item, percent: percentCompleted } : item
                    )
                );
                onProgress?.({ percent: percentCompleted });
            });
            onSuccess?.(result);
        } catch (error: any) {
            onError?.(error);
        }
    };

    return (
        <>
            <Upload
                customRequest={customUpload}
                fileList={imageList}
                onChange={handleChange}
                onRemove={handleRemove}
                accept=".jpg,.jpeg,.png"
                multiple
                listType="picture"
                showUploadList={false}
            >
                <Button type="dashed" icon={<UploadOutlined />}>
                    Upload
                </Button>
            </Upload>

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                    items={imageList.map(file => ({ id: file.uid }))}
                    strategy={verticalListSortingStrategy}
                >
                    <div className={styles.sortableContainer}>
                        {imageList.map((file) => (
                            <ImageUploaderItem
                                key={file.uid}
                                file={file}
                                handleRemove={handleRemove}
                                handleDescriptionChange={handleDescriptionChange}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </>
    );
};

export default ImageUploader;

