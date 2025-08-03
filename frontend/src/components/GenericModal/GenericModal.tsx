import { FunctionComponent, ReactNode } from 'react';
import { Modal } from 'antd';

interface GenericModalProps {
    open: boolean;
    title: string;
    content: ReactNode;
    onClose: () => void;
}

export const GenericModal: FunctionComponent<GenericModalProps> = ({ open, title, content, onClose }) => {
    return (
        <Modal
            title={title}
            open={open}
            onCancel={onClose}
            footer={null}
            maskClosable={false}
            width='auto'
        >
            {content}
        </Modal>
    );
};
