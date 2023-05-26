import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
    uri: 'https://api.studio.thegraph.com/query/46694/nftmarket_v2/version/latest',
    cache: new InMemoryCache()
})
