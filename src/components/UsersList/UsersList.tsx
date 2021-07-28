import React from "react";

import { StorageKeys } from "../../constants";
import { useUsersListQuery } from "../../generated/graphql";
import { Storage } from "../../utils/Storage";
import { CacheButtons } from "../CacheButtons/CacheButtons";
import { CheckboxRow } from "../CheckboxRow/CheckboxRow";
import { UsersListItem } from "../UsersListItem/UsersListItem";

import classes from "./UsersList.module.css";

export interface UsersListProps {
  onSelectUser?: ({ userId }: { userId: string }) => void;
}

export const UsersList = ({ onSelectUser }: UsersListProps) => {
  const [notifyOnChange, setNotifyOnChange] = React.useState(
    Storage.get(StorageKeys.NOTIFY_ON_CHANGE) ?? false
  );
  const updateNotifyOnChange = (isEnabled: boolean) => {
    setNotifyOnChange(isEnabled);
    Storage.set(StorageKeys.NOTIFY_ON_CHANGE, isEnabled);
  };

  const [useToReference, setUseToReference] = React.useState(
    Storage.get(StorageKeys.USE_TO_REFERENCE) ?? false
  );
  const updateUseToReference = (isEnabled: boolean) => {
    setUseToReference(isEnabled);
    Storage.set(StorageKeys.USE_TO_REFERENCE, isEnabled);
  };

  const [isPaginationEnabled, setPaginationEnabled] = React.useState(
    Storage.get(StorageKeys.PAGINATION_ENABLED) ?? false
  );
  const updatePaginationEnabled = (isEnabled: boolean) => {
    setPaginationEnabled(!isPaginationEnabled);
    Storage.set(StorageKeys.PAGINATION_ENABLED, isEnabled);
  };

  const limit = 5;
  const [offset, setOffset] = React.useState(0);
  const { data, loading, error, refetch, fetchMore } = useUsersListQuery({
    variables: {
      offset,
      limit,
    },
    notifyOnNetworkStatusChange: notifyOnChange,
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

      <CheckboxRow
        className={classes.checkboxRow}
        checked={notifyOnChange}
        onChange={updateNotifyOnChange}
      >
        notifyOnNetworkStatusChange
      </CheckboxRow>

      <CheckboxRow
        className={classes.checkboxRow}
        checked={useToReference}
        onChange={updateUseToReference}
      >
        toReference
      </CheckboxRow>

      <CheckboxRow
        className={classes.checkboxRow}
        checked={isPaginationEnabled}
        onChange={updatePaginationEnabled}
      >
        Pagination
      </CheckboxRow>

      <CacheButtons className={classes.gcButton} />

      {loading ? (
        <p>Loading...</p>
      ) : (
        !!data?.users.length && (
          <>
            <div className={classes.usersListHeader}>
              <p>
                Users: <b>{data.users.length}</b>
              </p>
              {Storage.get(StorageKeys.PAGINATION_ENABLED) ? (
                <>
                  <button className={classes.prevPage} onClick={prevPage}>
                    Prev
                  </button>
                  <p className={classes.currentPage}>
                    <b>{offset / limit}</b>
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
