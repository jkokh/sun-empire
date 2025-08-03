import { passwordPolicy } from '../constants/common';

export const generateUserName = () => {
    const shuffleString = (str: string) => {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
        }
        return arr.join('');
    };
    const timestampMillis = Date.now();
    const base36Timestamp = timestampMillis.toString(36).toUpperCase();
    return shuffleString(base36Timestamp).toLowerCase();
}

export const getDeviceId = () => {
    const key = 'deviceId';
    let deviceId = window.localStorage.getItem(key);
    if (!deviceId) {
        deviceId = generateUserName();
        window.localStorage.setItem(key, deviceId);
    }
    return deviceId;
}

export const getCookieValue = (name: string) => {
    const nameString = `${name}=`;
    const value = document.cookie.split(';').find(item => {
        const cookie = item.trim();
        return cookie.startsWith(nameString);
    });

    return value ? decodeURIComponent(value.split('=')[1]) : null;
}

export const loadScript = (src: string, async: boolean = true, defer: boolean = true) => {
    // Check if the script already exists
    if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.src = src;
        script.async = async;
        script.defer = defer;
        document.body.appendChild(script);
    }
};

export const scrollToTop = () => window.scrollTo({
    top: 0,
    behavior: 'smooth',
});

export const joinPaths = (...segments: string[]) => {
    if (segments.length === 0) return '';
    const joined = segments.join('/');
    return joined.replace(/\/+/g, '/');
}

export const getBasePath = (path: string) => {
    const prefix = process.env.NODE_ENV === 'local' ? '/public' : '';
    return joinPaths(prefix, path);
}

export const validatePassword = (password: string): boolean => {
    return passwordPolicy.test(password);
}