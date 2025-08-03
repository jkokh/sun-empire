import { useEffect, useState } from 'react';
import { UploadProps } from 'antd';
import { AxiosProgressEvent } from 'axios';
import { uploadFile, deleteFile } from '@/services/api.ts';
import { errorNotification, successNotification } from '@/services/notification.ts';
import { confirm } from '@/services/confirmation';
import { arrayMove } from '@dnd-kit/sortable';
import { ImageValue, ValidatedFile } from '@/components/admin/ImageUploader/ImageUploaderTypes.ts';

export const useImageUploader = (initialValue: ImageValue[], onChange: (fileList: ValidatedFile[]) => void) => {
    const transformToValidatedFile = (imageValue: ImageValue): ValidatedFile => ({
        uid: imageValue.identifier,
        name: imageValue.description,
        percent: 100,
        response: {
            imageId: imageValue.imageId,
            identifier: imageValue.identifier,
            extension: imageValue.extension
        }
    });




    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        let nl = newFileList.filter(item => item.name);
        const validatedFileList: ValidatedFile[] = nl as ValidatedFile[];
        const list = [...nl, ...initialValue.map(transformToValidatedFile)];
        setFileList(list);
        onChange(list);
    };

    const handleRemove = async (file: ValidatedFile) => {
        confirm('Are you sure you want to delete this file?', file.name, async () => {
            if (file.response?.imageId) {
                try {
                    await deleteFile(file.response.imageId);
                    setFileList((prevList) => {
                        const updatedList = prevList.filter((item) => item.uid !== file.uid);
                        if (updatedList.every(file => file.percent === 100)) {
                            onChange(updatedList);
                        }
                        return updatedList;
                    });
                    successNotification('File Deleted', `File ${file.name} deleted successfully.`);
                } catch {
                    errorNotification('File Deletion Error', `Failed to delete file: ${file.name}`);
                }
            } else {
                setFileList((prevList) => {
                    const updatedList = prevList.filter((item) => item.uid !== file.uid);
                    if (updatedList.every(file => file.percent === 100)) {
                        onChange(updatedList);
                    }
                    return updatedList;
                });
                successNotification('File Deleted', `File ${file.name} deleted successfully.`);
            }
        });
    };

    const handleDescriptionChange = (uid: string, description: string) => {
        const newFileList = fileList.map((item) =>
            item.uid === uid ? { ...item, description } : item
        );
        setFileList(newFileList);
        if (newFileList.every(file => file.percent === 100)) {
            onChange(newFileList);
        }
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const newFileList = arrayMove(
                fileList,
                fileList.findIndex((item) => item.uid === active.id),
                fileList.findIndex((item) => item.uid === over.id)
            );
            setFileList(newFileList);
            if (newFileList.every(file => file.percent === 100)) {
                onChange(newFileList);
            }
        }
    };

    return {
        imageList: fileList,
        handleFileUpload,
        handleChange,
        handleRemove,
        handleDescriptionChange,
        handleDragEnd,
    };
};