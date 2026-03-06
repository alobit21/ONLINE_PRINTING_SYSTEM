import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    // Use env var or default for dev local backend
    uri: 'http://localhost:8000/graphql/',
});

const authLink = setContext((_, { headers }) => {
    // 1. Try direct token key
    let token = localStorage.getItem('token');

    // 2. Fallback to Zustand persisted storage if direct key is missing
    if (!token || token === 'null' || token === 'undefined') {
        const authData = localStorage.getItem('auth-storage');
        if (authData) {
            try {
                const parsed = JSON.parse(authData);
                token = parsed.state?.token;
            } catch (e) {
                console.error("Error parsing auth-storage", e);
            }
        }
    }

    // Debug: Log what we found
    console.log('Apollo Auth Link - Token found:', !!token);
    console.log('Apollo Auth Link - Token value:', token ? token.substring(0, 20) + '...' : 'none');

    // Only send the header if we actually have a token
    if (!token || token === 'null' || token === 'undefined') {
        console.log('Apollo Auth Link - No token, sending headers without auth');
        return { headers };
    }

    const authHeaders = {
        headers: {
            ...headers,
            authorization: `JWT ${token}`,
        }
    };

    console.log('Apollo Auth Link - Sending headers with auth');
    return authHeaders;
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
