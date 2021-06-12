import React from "react";
import ReactDOM from "react-dom";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";

import App from "./components/App/App";
import { UserRemoveStatus, UserUpdateStatus } from "./generated/graphql";
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
      setUserUpdateStatus: (_, { userId, status }, { cache }) => {
        cache.writeFragment({
          id: cache.identify({ __typename: "User", id: userId }),
          fragment: UserInfoFragment,
          data: {
            updateStatus: status,
          },
        });

        return true;
      },
      setUserRemoveStatus: (_, { userId, status }, { cache }) => {
        cache.writeFragment({
          id: cache.identify({ __typename: "User", id: userId }),
          fragment: UserInfoFragment,
          data: {
            removeStatus: status,
          },
        });

        return true;
      },
    },
    User: {
      updateStatus: (user, _, { cache }) => {
        const cacheUser = cache.readFragment({
          id: cache.identify(user),
          fragment: UserInfoFragment,
        });

        return cacheUser?.updateStatus || UserUpdateStatus.None;
      },
      removeStatus: (user, _, { cache }) => {
        const cacheUser = cache.readFragment({
          id: cache.identify(user),
          fragment: UserInfoFragment,
        });

        return cacheUser?.removeStatus || UserRemoveStatus.None;
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
