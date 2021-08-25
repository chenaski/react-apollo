import cn from "classnames";
import React from "react";

import { useReactiveVar } from "@apollo/client";

import { StorageKeys } from "../../constants";
import { useUsersListQuery } from "../../generated/graphql";
import { vipUsersIdsVar } from "../../store";
import { Storage } from "../../utils/Storage";
import { UsersListItem } from "../UsersListItem/UsersListItem";
import { UsersListOptions } from "../UsersListOptions/UsersListOptions";

import classes from "./UsersList.module.css";

export interface UsersListProps {
  onSelectUser?: ({ userId }: { userId: string }) => void;
}

export const UsersList = ({ onSelectUser }: UsersListProps) => {
  const limit = 5;
  const [offset, setOffset] = React.useState(0);
  const { data, loading, error, refetch, fetchMore } = useUsersListQuery({
    variables: {
      offset,
      limit,
    },
    notifyOnNetworkStatusChange: Storage.get(StorageKeys.NOTIFY_ON_CHANGE),
  });
  const onClickMore = async () => {
    const nextOffset = offset + limit;

    await fetchMore({
      variables: {
        offset: nextOffset,
      },
    });

    setOffset(nextOffset);
  };
  const nextPage = async () => {
    const nextOffset = offset + limit;

    await fetchMore({
      variables: {
        offset: nextOffset,
      },
    });

    setOffset(nextOffset);
  };
  const prevPage = async () => {
    const nextOffset = offset - limit;

    await fetchMore({
      variables: {
        offset: nextOffset,
      },
    });

    setOffset(nextOffset);
  };

  const getErrorMessage = (): string | null => {
    if (loading) return null;
    if (error?.message) return error.message;
    else if (!data?.users.length) return "There is no data available";
    return null;
  };
  const errorMessage = getErrorMessage();

  const vipUsersIds = useReactiveVar(vipUsersIdsVar);

  return (
    <section>
      <UsersListOptions loading={loading} refetch={refetch} />

      {loading ? (
        <p>Loading...</p>
      ) : (
        !!data?.users.length && (
          <>
            <div className={classes.usersListHeader}>
              <p>
                Users: <b>{offset + limit}</b>
              </p>
              {Storage.get(StorageKeys.OFFSET_PAGINATION_ENABLED) ? (
                <>
                  <button className={classes.prevPage} onClick={prevPage}>
                    Prev
                  </button>
                  <p className={classes.currentPage}>
                    <b>{offset / limit + 1}</b>
                  </p>
                  <button className={classes.nextPage} onClick={nextPage}>
                    Next
                  </button>
                </>
              ) : (
                <button
                  className={classes.showMoreButton}
                  onClick={onClickMore}
                >
                  Show more
                </button>
              )}
            </div>

            <ul className={classes.list}>
              {data.users.map((user) => (
                <li
                  key={user.id}
                  className={cn([
                    classes.listItem,
                    { [classes.vip]: vipUsersIds.includes(user.id) },
                  ])}
                >
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
