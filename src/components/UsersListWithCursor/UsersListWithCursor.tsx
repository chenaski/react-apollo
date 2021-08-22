import React from "react";

import { StorageKeys } from "../../constants";
import { useUsersListWithCursorQuery } from "../../generated/graphql";
import { Storage } from "../../utils/Storage";
import { UsersListItem } from "../UsersListItem/UsersListItem";
import { UsersListOptions } from "../UsersListOptions/UsersListOptions";

import classes from "./UsersListWithCursor.module.css";

export interface UsersListProps {
  onSelectUser?: ({ userId }: { userId: string }) => void;
}

export const UsersListWithCursor = ({ onSelectUser }: UsersListProps) => {
  const limit = 5;
  const { data, loading, error, refetch, fetchMore } =
    useUsersListWithCursorQuery({
      variables: {
        limit,
      },
      notifyOnNetworkStatusChange: Storage.get(StorageKeys.NOTIFY_ON_CHANGE),
    });

  const { users, usersCountBefore, nextCursor, prevCursor } =
    data?.usersListWithCursor || {
      users: [],
      usersCountBefore: 0,
    };

  const nextPage = async () => {
    await fetchMore({
      variables: {
        cursor: nextCursor
          ? {
              id: nextCursor.id,
              createdAt: nextCursor.createdAt,
            }
          : null,
      },
    });
  };
  const prevPage = async () => {
    await fetchMore({
      variables: {
        cursor: prevCursor
          ? {
              id: prevCursor.id,
              createdAt: prevCursor.createdAt,
            }
          : null,
      },
    });
  };

  const getErrorMessage = (): string | null => {
    if (loading) return null;
    if (error?.message) return error.message;
    else if (!users.length) return "There is no data available";
    return null;
  };
  const errorMessage = getErrorMessage();

  return (
    <section>
      <UsersListOptions loading={loading} refetch={refetch} />

      {loading ? (
        <p>Loading...</p>
      ) : (
        !!users.length && (
          <>
            <div className={classes.usersListHeader}>
              <p>
                Users: <b>{usersCountBefore}</b>
              </p>
              <button className={classes.prevPage} onClick={prevPage}>
                Prev
              </button>
              <p className={classes.currentPage}>
                <b>{usersCountBefore / limit}</b>
              </p>
              <button className={classes.nextPage} onClick={nextPage}>
                Next
              </button>{" "}
            </div>

            <ul className={classes.list}>
              {users.map((user) => (
                <li key={user.id} className={classes.listItem}>
                  <UsersListItem userId={user.id} onSelectUser={onSelectUser} />
                </li>
              ))}
            </ul>
          </>
        )
      )}

      {errorMessage && <p>{errorMessage}</p>}
    </section>
  );
};
