Live Site - https://crown-clothing-graph-ql.herokuapp.com/

# This implementation is focused mostly on an Apollo + GraphQL setup - styling/ UI is minimal

-   Notes on Redux, Sagas, Firebase, Stripe API, can be found in the optimized repo
-   https://github.com/kawgh1/react-crown-clothing-optimized

-   Based off of Yihua's course
-   https://github.com/ZhangMYihua/graphql-practice-complete

-   ## Tools Used

    -   Apollo Boost
    -   React Apollo
    -   GraphQL
    -   **npm install apollo-boost react-apollo graphql**

-   ### GraphQL

    ![graph-ql-diagram](https://raw.githubusercontent.com/kawgh1/crown-clothing-graph-ql/master/diagrams/graphql-diagram.png)

    -   GraphQL is a backend language that wraps around an existing database or server that you can make requests to in a different (ideally more efficient, flexible) way than the traditional CRUD / REST (GET, POST, PUT, DELETE) way
    -   REST Example
        -   In order to get a user's comments, user might have to send request to /user endpoint, then user/id/posts endpoint, then user/id/posts/id/comments
        -   lots of back and forth and potentially getting back lots and lots of data we dont need
    -   Graph QL Example

        -   Convert backend server into GraphQL server, only one endpoint, we get whatever data we need, and only that data, the first time, with only one request

    -   #### GraphQL in Practice

        -   requests are made using Queries or Mutations
            -   Queries get data, Mutations modify data
        -   Schema

                type Collection {
                    id: ID!
                    title: String!
                    items: [Item!]!
                }

                type Item {
                    id: ID!
                    name: String!
                    price: Float!
                    imageUrl: String!
                    collection: Collection
                }

                type Query {
                    collections: [Collection!]!
                    collection(id: ID!): Collection
                    getCollectionsByTitle(title: String): Collection
                }

        -   Query code

                  query {
                      collections {
                          id
                          title
                          items {
                              id
                              name
                              price
                          }
                      }
                  }

        -   Returns =>

                  "data": {
                      "collections": [
                          "id": "cjquasdf121",
                          "title": "Hats",
                          "items": [
                              {
                                  "id": "adflasdf14324",
                                  "name": "Brown Brim",
                                  "price": 25
                              },
                              {
                                  "id": "hgfddfgh355",
                                  "name": "Blue Beanie",
                                  "price": 18
                              },
                              {
                                  "id": "asdff213r",
                                  "name": "Gray Fedora",
                                  "price": 40
                              },
                              ...
                              ...
                          ]
                      ]
                  }

    -   ### Building a (backend) GraphQL Server

        -   #### Example
            -   Example using the tools listed below
            -   https://github.com/ZhangMYihua/crwn-clothing-prisma
        -   #### Prisma
            -   ORM for Node with tools for SQL databases as well
            -   https://www.prisma.io/
        -   #### Hasura
            -   Connect Hasura to an existing database and generate a production ready GraphQL API in seconds
            -   https://hasura.io/
        -   #### Apollo Server

            -   Apollo Server is an open-source, spec-compliant GraphQL server that's compatible with any GraphQL client, including Apollo Client. Great way to build production ready, self-documenting GraphQL API that can use data from any source
            -   https://www.apollographql.com/docs/apollo-server/

        -   #### More Graph QL Tools
            -   GraphQL-yoga
                -   https://github.com/dotansimha/graphql-yoga
            -   Step by step how to build a Graph QL server
                -   https://www.apollographql.com/docs/tutorial/introduction/

    -   ### Graph QL vs REDUX

        -   You can use GraphQL and Redux together, but it does add a layer of complexity because now you are managing essentially, two different sets of STATE on the front end - which was what both of these solutions tried to solve in the first place, only one single source of State for the whole app
        -   REDUX is very strong and established, can do just about anything
        -   Graph QL + Apollo are still being developed - troubleshooting and support may be more difficult when building custom solutions

    -   ### Apollo
        ![apollo-diagram](https://raw.githubusercontent.com/kawgh1/crown-clothing-graph-ql/master/diagrams/apollo-diagram.png)

-   ### Collection Container example

    -   src/pages/collection/collection.container.js

            import React from "react";
            import { Query } from "react-apollo";
            import { gql } from "apollo-boost";

            import CollectionPage from "./collection.component";
            import Spinner from "../../components/spinner/spinner.component";

            const GET_COLLECTION_BY_TITLE = gql`
                query getCollectionsByTitle($title: String!) {
                    getCollectionsByTitle(title: $title) {
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
            `;

            const CollectionPageContainer = ({ match }) => (
                <Query
                    query={GET_COLLECTION_BY_TITLE}
                    variables={{ title: match.params.collectionId }}
                >
                    {({ loading, data }) => {
                        if (loading) return <Spinner />;
                        const { getCollectionsByTitle } = data;
                        return <CollectionPage collection={getCollectionsByTitle} />;
                    }}
                </Query>
            );
            export default CollectionPageContainer;

-   ### `Compose` Error

    -   `compose` was removed from React-Apollo 3 - this was a breaking change

    -   To fix, install lodash.flowright
    -   **see src/components/cart-icon/cart-icon.container.jsx**
    -   see notes
        -   https://stackoverflow.com/questions/57445294/compose-not-exported-from-react-apollo
