import { useUsersListQuery } from "../../generated/graphql";
import { UsersListItem } from "../UsersListItem/UsersListItem";

import classes from "./UsersList.module.css";

export interface UsersListProps {
  onSelectUser: ({ userId }: { userId: string }) => void;
}

export const UsersList = ({ onSelectUser }: UsersListProps) => {
  const { data, loading, error } = useUsersListQuery();

  const getErrorMessage = (): string | null => {
    if (loading) return null;
    if (error?.message) return error.message;
    else if (!data?.users.length) return "There is no data available";
    return null;
  };
  const errorMessage = getErrorMessage();

  return (
    <section>
      <h1>Users</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        !!data?.users.length && (
          <ul>
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
