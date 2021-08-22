import React from "react";

import { StorageKeys } from "../../constants";
import { Storage } from "../../utils/Storage";
import { UsersList } from "../UsersList/UsersList";
import { UsersListWithCursor } from "../UsersListWithCursor/UsersListWithCursor";

export interface UsersListProps {
  onSelectUser?: ({ userId }: { userId: string }) => void;
}

export const UsersListContainer = ({ onSelectUser }: UsersListProps) => {
  return (
    <section>
      {Storage.get(StorageKeys.CURSOR_PAGINATION_ENABLED) ? (
        <UsersListWithCursor onSelectUser={onSelectUser} />
      ) : (
        <UsersList onSelectUser={onSelectUser} />
      )}
    </section>
  );
};
