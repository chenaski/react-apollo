import {
  useRemoveUserMutation,
  useUsersListQuery,
} from "../../generated/graphql";
import classes from "./UsersList.module.css";

export const UsersList = () => {
  const { data, loading, error } = useUsersListQuery();
  const [
    removeUserMutation,
    { loading: removeUserLoading, error: removeUserError },
  ] = useRemoveUserMutation();

  const handleRemoveButtonClick = async (id: string) => {
    await removeUserMutation({ variables: { id } });
  };

  return (
    <section>
      <h1>Users</h1>

      {loading ? (
        <p>Loading...</p>
      ) : data?.users.length ? (
        <ul>
          {data.users.map((user) => (
            <li key={user.id} className={classes.listItem}>
              {user.name}
              <button
                className={classes.removeButton}
                onClick={() => handleRemoveButtonClick(user.id)}
                disabled={removeUserLoading}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>There is no data available</p>
      )}

      {(!!error || !!removeUserError) && <p>{error || removeUserError}</p>}
    </section>
  );
};
