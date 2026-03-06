/**
 * Centralized authentication utilities
 */

export const getAuthToken = (): string | null => {
    // 1. Try direct token key
    let token = localStorage.getItem('token');

    if (!token || token === 'null' || token === 'undefined') {
        // 2. Fallback to Zustand persisted storage
        const authData = localStorage.getItem('auth-storage');
        if (authData) {
            try {
                const parsed = JSON.parse(authData);
                token = parsed.state?.token;
            } catch (e) {
                console.error('Error parsing auth-storage', e);
            }
        }
    }

    if (!token || token === 'null' || token === 'undefined') {
        // 3. Try legacy authToken key
        token = localStorage.getItem('authToken');
    }

    return token && token !== 'null' && token !== 'undefined' ? token : null;
};

/**
 * Returns ONLY the Authorization header.
 *
 * Do NOT include Content-Type here — this function is used for both JSON
 * requests and binary file fetches (images, PDFs, videos). Sending
 * Content-Type: application/json on a binary fetch confuses some backends
 * and can cause 400/401 responses unrelated to the token itself.
 *
 * Add Content-Type in the call site when needed (e.g. JSON POST requests).
 */
export const getAuthHeaders = (): Record<string, string> => {
    const token = getAuthToken();
    if (!token) return {};
    return { Authorization: `JWT ${token}` };
};

/**
 * Returns Authorization + Content-Type: application/json.
 * Use this for JSON API calls (GraphQL, REST mutations, etc.).
 */
export const getJsonAuthHeaders = (): Record<string, string> => {
    return {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
    };
};

export const isAuthenticated = (): boolean => getAuthToken() !== null;