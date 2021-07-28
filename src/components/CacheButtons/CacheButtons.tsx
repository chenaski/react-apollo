import React from "react";

import { useApolloClient } from "@apollo/client";

import classes from "./CacheButtons.module.css";

export interface GCButtonProps {
  className?: string;
}

export const CacheButtons = ({ className }: GCButtonProps) => {
  const apolloClient = useApolloClient();
  const [removedIds, setRemovedIds] = React.useState<string[]>([]);

  const gc = () => {
    const removedIds = apolloClient.cache.gc();
    setRemovedIds(removedIds);
  };

  const clearStore = () => {
    return apolloClient.clearStore();
  };

  const resetStore = () => {
    return apolloClient.resetStore();
  };

  return (
    <div className={className}>
      <div className={classes.buttons}>
        <button onClick={gc}>cache.gc()</button>
        <button onClick={clearStore}>cache.clear()</button>
        <button onClick={resetStore}>cache.reset()</button>
      </div>

      {!!removedIds.length && (
        <>
          <button onClick={() => setRemovedIds([])}>Clear</button>

          <ul>
            {removedIds.map((id) => (
              <li>{id}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
