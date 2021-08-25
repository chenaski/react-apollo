import { useGetUserQuery } from "../../generated/graphql";
import { vipUsersIdsVar } from "../../store";
import { UserStatus } from "../UserStatus/UserStatus";

import classes from "./UsersListItem.module.css";

export interface UsersListItemProps {
  userId: string;
  onSelectUser?: ({ userId }: { userId: string }) => void;
}

export const UsersListItem = ({ userId, onSelectUser }: UsersListItemProps) => {
  const { data, loading, error } = useGetUserQuery({
    variables: { userId },
  });

  if (loading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>Something went wrong...</p>;
  } else if (!data?.user) {
    return <p>User not found</p>;
  }

  const user = data.user;

  const onChangeVipStatus = ({ userId }: { userId: string }) => {
    const vipUsersIds = vipUsersIdsVar();

    if (!vipUsersIds.includes(userId)) {
      vipUsersIdsVar([...vipUsersIds, userId]);
    } else {
      vipUsersIdsVar(vipUsersIds.filter((id) => id !== userId));
    }
  };

  return (
    <>
      <div className={classes.userInfoRow}>
        <p className={classes.userName}>
          <b>{user.username}</b>

          <UserStatus
            updateStatus={user.updateStatus}
            removeStatus={user.removeStatus}
          />
        </p>

        <div className={classes.userActions}>
          <button
            onClick={() => onSelectUser && onSelectUser({ userId: user.id })}
          >
            Edit
          </button>
          <button onClick={() => onChangeVipStatus({ userId })}>Vip</button>
        </div>
      </div>

      {!!user.friends.length && (
        <div className={classes.friendsListContainer}>
          <p className={classes.friendsListTitle}>Friends:</p>

          <ul className={classes.friendsList}>
            {user.friends.map((friend) => (
              <li key={friend.id}>{friend.username}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
