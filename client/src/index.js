import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// Apollo
// Provider allows the rest of our app to access the STATE that is stored on Apollo
import { ApolloProvider } from "react-apollo";
// http link lets us connect our client to our specific /graphql endpoint
import { createHttpLink } from "apollo-link-http";
// Apollo uses this to cache the data it gets in local memory
import { InMemoryCache } from "apollo-cache-inmemory";
// Apollo boost contains a lot of smaller apollo libraries bundled together - such as createHttpLink and InMemoryCache
import { gql } from "apollo-boost";
// 'gql' above is a graphql data object format so that graphql data object can be passed back and forth and read
// between graphql and apollo

import ApolloClient from "apollo-client";

import { store, persistor } from "./redux/store";

import "./index.css";
import App from "./App/App";

// graphql
import { resolvers, typeDefs } from "./graphql/resolvers";
// dummy data
import { default as data } from "./graphql/initial-data";

// this uri is a dummy Apollo/GraphQL server created by Yihua for dev purposes
const apolloHttpLink = createHttpLink({
    uri: "https://mysterious-reaches-23758.herokuapp.com/https://crwn-clothing.com",
});

// Top level local storage memory Cache
const apolloCache = new InMemoryCache();

// Apollo client
const apolloClient = new ApolloClient({
    link: apolloHttpLink,
    cache: apolloCache,
    typeDefs: typeDefs,
    resolvers: resolvers,
});

// initialize data
apolloClient.writeData({ data });

// Query example, this just console.logs the hats
apolloClient
    .query({
        query: gql`
            {
                getCollectionsByTitle(title: "hats") {
                    id
                    title
                    items {
                        id
                        name
                        price
                        imageUrl
                    }
                }
            }
        `,
    })
    .then((res) => console.log(res));

ReactDOM.render(
    <ApolloProvider client={apolloClient}>
        <Provider store={store}>
            <BrowserRouter>
                <PersistGate persistor={persistor}>
                    <App />
                </PersistGate>
            </BrowserRouter>
        </Provider>
    </ApolloProvider>,
    document.getElementById("root")
);
