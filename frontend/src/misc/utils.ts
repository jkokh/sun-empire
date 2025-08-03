export const localizedUrl = (url: string): string => {
    const currentLocale = window.appConfig.currentLocale;
    return currentLocale === 'en' ? url : `/${currentLocale}${url}`
}