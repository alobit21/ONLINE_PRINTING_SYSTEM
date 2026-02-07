import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = createHttpLink({
    // Use env var or default for dev local backend
    uri: 'http://localhost:8000/graphql/',
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `JWT ${token}` : "",
        }
    }
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
