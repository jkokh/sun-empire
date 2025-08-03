import { getCookieValue } from '../../../src/misc/utils';
import { keepAlive } from '../services/api';
import { tokenExpCookieName } from '../../../src/constants/common.ts';

export const monitorTokenExpiration = (): void => {
    const bufferTime: number = 20 * 1000; // Buffer time in milliseconds
    const retryDelay: number = 3 * 1000; // Delay between retries in milliseconds
    let retryCount = 0;
    const maxRetries: number = 3; // Maximum number of retry attempts

    const sendKeepAlive = () => {
        const expiresInStr: string | null = getCookieValue(tokenExpCookieName);
        if (!expiresInStr) {
            console.error('No token expiration information available.');
            return; // Exit if no expiration info is available
        }

        // Convert expiresIn to milliseconds
        const expiresIn: number = parseInt(expiresInStr, 10);
        const expirationDate = new Date(expiresIn * 1000); // Convert Unix timestamp to Date object
        const now = new Date();
        const timeUntilExpiration = expirationDate.getTime() - now.getTime(); // Time until expiration in milliseconds

        // Calculate when to send keep-alive request
        const keepAliveTime = timeUntilExpiration - bufferTime;

        // Check if it's already time to send keep-alive or schedule it
        if (keepAliveTime <= 0) {
            attemptKeepAlive();
        } else {
            setTimeout(attemptKeepAlive, keepAliveTime);
        }
    };

    const attemptKeepAlive = () => {
        keepAlive()
            .then(() => {
                console.log('Keep-alive request successful.');
                retryCount = 0; // Reset retry count after successful keep-alive
                sendKeepAlive(); // Schedule next keep-alive based on new token expiration
            })
            .catch((error) => {
                console.error('Keep-alive request failed:', error);
                retryCount++;
                if (retryCount <= maxRetries) {
                    setTimeout(attemptKeepAlive, retryDelay);
                } else {
                    console.error('Max keep-alive retry attempts reached.');
                    retryCount = 0; // Optionally reset retry count or handle max retries failure
                }
            });
    };

    // Start the first keep-alive check
    sendKeepAlive();
};
