import React from "react";

import { useApolloClient } from "@apollo/client";

import {
  ServerAction,
  useServerActionPerformedSubscription,
} from "../../generated/graphql";

import classes from "./Notifications.module.css";

export const Notifications = () => {
  const apolloClient = useApolloClient();
  const [lastServerActionsList, setLastServerActionsList] = React.useState<
    ServerAction[]
  >([]);
  const lastServerActionsListRef = React.useRef(lastServerActionsList);

  React.useEffect(() => {
    lastServerActionsListRef.current = lastServerActionsList;
  });

  const onReceiveServerAction = (serverAction: ServerAction) => {
    setLastServerActionsList([
      ...lastServerActionsListRef.current,
      serverAction,
    ]);

    setTimeout(() => {
      setLastServerActionsList(
        lastServerActionsListRef.current.filter(
          ({ date }) => date !== serverAction.date
        )
      );
    }, 6000);
  };

  useServerActionPerformedSubscription({
    onSubscriptionData: ({ subscriptionData }) => {
      const serverAction = subscriptionData.data?.serverActionPerformed;

      if (serverAction) {
        onReceiveServerAction(serverAction);
      }
    },
  });

  apolloClient.onClearStore(() => {
    onReceiveServerAction({
      __typename: "ServerAction",
      date: new Date().toISOString(),
      message: "Apollo cache has been cleared successfully",
    });

    return Promise.resolve();
  });
  apolloClient.onResetStore(() => {
    onReceiveServerAction({
      __typename: "ServerAction",
      date: new Date().toISOString(),
      message: "Apollo cache has been restored successfully",
    });

    return Promise.resolve();
  });

  if (!lastServerActionsList.length) return null;

  return (
    <ul className={classes.notifications}>
      {lastServerActionsList.map(({ date, message }) => {
        return (
          <li key={date} className={classes.notification}>
            [{new Date(date).toLocaleTimeString()}] {message}
          </li>
        );
      })}
    </ul>
  );
};
