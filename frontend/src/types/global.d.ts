// global.d.ts
interface AppConfig {
    currentLocale: string;
}

interface Window {
    appConfig: AppConfig;
}
