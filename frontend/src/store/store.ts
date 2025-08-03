import { create } from 'zustand';

interface RegProgressState {
    progress: number; // 0 to 100
    setProgress: (value: number) => void;
}

export const regProgress = create<RegProgressState>((set) => ({
    progress: 0,
    setProgress: (value: number) => set({ progress: value }),
}));
