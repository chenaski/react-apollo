import React from "react";

import { useApolloClient } from "@apollo/client";

export interface GCButtonProps {
  className?: string;
}

export const GCButton = ({ className }: GCButtonProps) => {
  const apolloClient = useApolloClient();
  const [removedIds, setRemovedIds] = React.useState<string[]>([]);

  const gc = () => {
    const removedIds = apolloClient.cache.gc();
    setRemovedIds(removedIds);
  };

  return (
    <div className={className}>
      <button onClick={gc}>cache.gc()</button>

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
