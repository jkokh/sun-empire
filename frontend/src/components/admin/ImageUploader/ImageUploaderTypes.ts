import { UploadFile } from 'antd';
import { ImageUploadResponse } from '../../../../../src/types';

export type ValidatedFile = UploadFile<ImageUploadResponse> & {
    errorMessage?: string;
    description?: string;
};

export type ImageUploaderProps = {
    value: ImageValue[];
    onChange: (fileList: ValidatedFile[]) => void;
};

export type ImageUploaderItemProps = {
    file: ValidatedFile;
    handleRemove: (file: ValidatedFile) => void;
    handleDescriptionChange: (uid: string, description: string) => void;
};

export type ImageValue = {
    description: string;
    imageId: number;
    extension: string;
    identifier: string;
};