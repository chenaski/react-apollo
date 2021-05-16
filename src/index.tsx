import React from "react";
import ReactDOM from "react-dom";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";

import App from "./components/App/App";
import { UserInfoFragment } from "./graphql/UserInfoFragment";
import { typeDefs } from "./graphql/typeDefs";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const uri = `http://localhost:${process.env.REACT_APP_SERVER_PORT}/`;

const link = new BatchHttpLink({
  uri,
  batchMax: 50,
  batchInterval: 20,
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  typeDefs,
  resolvers: {
    Mutation: {
      setIsUserChanged: (_, { id, isChanged }, { cache }) => {
        cache.writeFragment({
          id: cache.identify({ __typename: "User", id }),
          fragment: UserInfoFragment,
          data: {
            isChanged,
          },
        });

        return true;
      },
    },
    User: {
      isChanged: (user, _, { cache }) => {
        const cacheUser = cache.readFragment({
          id: cache.identify(user),
          fragment: UserInfoFragment,
        });

        return cacheUser?.isChanged || false;
      },
    },
  },
  connectToDevTools: true,
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
