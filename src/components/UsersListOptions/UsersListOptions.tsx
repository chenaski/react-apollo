import React from "react";

import { StorageKeys } from "../../constants";
import { Storage } from "../../utils/Storage";
import { CacheButtons } from "../CacheButtons/CacheButtons";
import { CheckboxRow } from "../CheckboxRow/CheckboxRow";

import classes from "./UsersListOptions.module.css";

export interface UsersListOptionsProps {
  refetch: () => void;
  loading: boolean;
}

export const UsersListOptions = ({
  refetch,
  loading,
}: UsersListOptionsProps) => {
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

  const [isOffsetPaginationEnabled, setOffsetPaginationEnabled] =
    React.useState(Storage.get(StorageKeys.OFFSET_PAGINATION_ENABLED) ?? false);
  const updateOffsetPaginationEnabled = (isEnabled: boolean) => {
    setOffsetPaginationEnabled(!isOffsetPaginationEnabled);
    setCursorPaginationEnabled(false);
    Storage.set(StorageKeys.OFFSET_PAGINATION_ENABLED, isEnabled);
    Storage.set(StorageKeys.CURSOR_PAGINATION_ENABLED, false);
  };

  const [isCursorPaginationEnabled, setCursorPaginationEnabled] =
    React.useState(Storage.get(StorageKeys.CURSOR_PAGINATION_ENABLED) ?? false);
  const updateCursorPaginationEnabled = (isEnabled: boolean) => {
    setCursorPaginationEnabled(!isCursorPaginationEnabled);
    setOffsetPaginationEnabled(false);
    Storage.set(StorageKeys.CURSOR_PAGINATION_ENABLED, isEnabled);
    Storage.set(StorageKeys.OFFSET_PAGINATION_ENABLED, false);
  };

  return (
    <div>
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
        checked={isOffsetPaginationEnabled}
        onChange={updateOffsetPaginationEnabled}
      >
        Offset Pagination
      </CheckboxRow>

      <CheckboxRow
        className={classes.checkboxRow}
        checked={isCursorPaginationEnabled}
        onChange={updateCursorPaginationEnabled}
      >
        Cursor Pagination
      </CheckboxRow>

      <CacheButtons className={classes.gcButton} />
    </div>
  );
};
