import { notification } from 'antd';

interface NotificationOptions {
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
    description: string;
    duration?: number;
}

const notify = (options: NotificationOptions): void => {
    const { type, message, description, duration = 4.5 } = options;
    notification[type]({
        message,
        description,
        duration
    });
};

export const errorNotification = (message: string, description: string): void => {
    notify({ type: 'error', message, description });
};

export const successNotification = (message: string, description: string): void => {
    notify({ type: 'success', message, description });
};

export const warningNotification = (message: string, description: string): void => {
    notify({ type: 'warning', message, description });
};

export const infoNotification = (message: string, description: string): void => {
    notify({ type: 'info', message, description });
};
