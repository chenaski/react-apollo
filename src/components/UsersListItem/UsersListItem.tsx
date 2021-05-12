import classes from "./UsersListItem.module.css";
import {
  useGetUserQuery,
  useRemoveUserMutation,
} from "../../generated/graphql";

export interface UsersListItemProps {
  userId: string;
  onSelectUser: ({ userId }: { userId: string }) => void;
}

export const UsersListItem = ({ userId, onSelectUser }: UsersListItemProps) => {
  const { data, loading, error } = useGetUserQuery({
    variables: { id: userId },
  });
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

  if (loading) {
    return <p>Loading...</p>;
  } else if (error || removeUserError) {
    return (
      <p>
        {error?.message ||
          removeUserError?.message ||
          "Something went wrong..."}
      </p>
    );
  } else if (!data?.user) {
    return <p>User not found</p>;
  } else if (removeUserLoading) {
    return <p>User removing...</p>;
  }

  const user = data.user;

  return (
    <>
      <p className={classes.userName}>{user.name}</p>

      <button onClick={() => onSelectUser({ userId: user.id })}>
        Show profile
      </button>

      <button
        className={classes.removeButton}
        onClick={() => handleRemoveButtonClick(user.id)}
        disabled={removeUserLoading}
      >
        ×
      </button>

      {!!user.friends.length && (
        <ul className={classes.friendsList}>
          {user.friends.map((friend) => (
            <li key={friend.id}>
              {friend.name}{" "}
              <button onClick={() => onSelectUser({ userId: friend.id })}>
                Show profile
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
