import { Modal } from 'antd';

export const confirm =(title: string, content: string, onOk: () => Promise<void>, onCancel?: () => void) => {
    Modal.confirm({
        title,
        content,
        okText: 'Yes',
        cancelText: 'No',
        onOk,
        onCancel,
    });
};
