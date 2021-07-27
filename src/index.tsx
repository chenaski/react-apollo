import React from "react";
import ReactDOM from "react-dom";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  split,
} from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

import App from "./components/App/App";
import { StorageKeys } from "./constants";
import { UserRemoveStatus, UserUpdateStatus } from "./generated/graphql";
import { UserInfoFragment } from "./graphql/UserInfoFragment";
import { typeDefs } from "./graphql/typeDefs";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { Storage } from "./utils/Storage";

const httpUrl = `http://localhost:${process.env.REACT_APP_SERVER_PORT}/`;
const wsUrl = `ws://localhost:${process.env.REACT_APP_SERVER_PORT}/subscriptions`;

const httpLink = new BatchHttpLink({
  uri: httpUrl,
  batchMax: 50,
  batchInterval: 20,
});

const wsLink = new WebSocketLink({
  uri: wsUrl,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          ...(Storage.get(StorageKeys.USE_TO_REFERENCE)
            ? {
                user(_, { args, toReference }) {
                  if (!args?.userId) return null;
                  return toReference({
                    __typename: "User",
                    id: args.userId,
                  });
                },
              }
            : {}),
        },
      },
    },
  }),
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
