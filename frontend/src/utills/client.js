import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
    uri: 'https://api.studio.thegraph.com/query/46694/nftmarket/v0.0.2',
    cache: new InMemoryCache()
})
