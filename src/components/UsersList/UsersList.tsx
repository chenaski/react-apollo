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
  ] = useRemoveUserMutation({
    update: (cache, { data }) => {
      if (data?.removeUser) {
        cache.evict({
          id: cache.identify(data?.removeUser),
        });
      }
    },
  });

  const handleRemoveButtonClick = async (id: string) => {
    await removeUserMutation({ variables: { id } });
  };

  const getErrorMessage = (): string | null => {
    if (error?.message) return error.message;
    else if (removeUserError?.message) return removeUserError.message;
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
        )
      )}

      {errorMessage && <p>{errorMessage}</p>}
    </section>
  );
};
