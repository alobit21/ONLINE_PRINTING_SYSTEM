import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';

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

    // Only send the header if we actually have a token
    if (!token || token === 'null' || token === 'undefined') {
        return { headers };
    }

    return {
        headers: {
            ...headers,
            authorization: `JWT ${token}`,
        }
    }
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
