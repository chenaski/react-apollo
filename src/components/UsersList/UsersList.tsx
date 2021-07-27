import React from "react";

import { StorageKeys } from "../../constants";
import { useUsersListQuery } from "../../generated/graphql";
import { Storage } from "../../utils/Storage";
import { CheckboxRow } from "../CheckboxRow/CheckboxRow";
import { GCButton } from "../GCButton/GCButton";
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

  const { data, loading, error, refetch } = useUsersListQuery({
    notifyOnNetworkStatusChange: notifyOnChange,
  });

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

      <GCButton className={classes.gcButton} />

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
