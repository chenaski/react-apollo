import React from "react";

import { useUsersListQuery } from "../../generated/graphql";
import { UsersListItem } from "../UsersListItem/UsersListItem";

import classes from "./UsersList.module.css";

export interface UsersListProps {
  onSelectUser?: ({ userId }: { userId: string }) => void;
}

export const UsersList = ({ onSelectUser }: UsersListProps) => {
  const { data, loading, error, refetch } = useUsersListQuery();

  const getErrorMessage = (): string | null => {
    if (loading) return null;
    if (error?.message) return error.message;
    else if (!data?.users.length) return "There is no data available";
    return null;
  };
  const errorMessage = getErrorMessage();

  return (
    <section>
      <div className={classes.header}>
        <h2 className={classes.title}>Users</h2>
        <button
          className={classes.refetechButton}
          onClick={() => refetch()}
          disabled={loading}
        >
          ↻
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        !!data?.users.length && (
          <ul className={classes.list}>
            {data.users.map((user) => (
              <li key={user.id} className={classes.listItem}>
                <UsersListItem userId={user.id} onSelectUser={onSelectUser} />
              </li>
            ))}
          </ul>
        )
      )}

      {errorMessage && <p>{errorMessage}</p>}
    </section>
  );
};
