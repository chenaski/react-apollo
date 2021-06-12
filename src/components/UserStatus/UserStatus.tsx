import cn from "classnames";

import { UserRemoveStatus, UserUpdateStatus } from "../../generated/graphql";

import classes from "./UserStatus.module.css";

export interface UserStatusProps {
  updateStatus: UserUpdateStatus;
  removeStatus: UserRemoveStatus;
}

export const UserStatus = ({ updateStatus, removeStatus }: UserStatusProps) => {
  const getParams = () => {
    if (removeStatus !== UserRemoveStatus.None) {
      return {
        [UserRemoveStatus.Started]: {
          text: "Removing...",
          className: [classes.statusRemoving],
        },
        [UserRemoveStatus.Success]: {
          text: "Removed",
          className: [classes.statusRemoved],
        },
        [UserRemoveStatus.Failure]: {
          text: "Remove Fail",
          className: [classes.statusRemoveFailure],
        },
      }[removeStatus];
    }

    if (updateStatus !== UserUpdateStatus.None) {
      return {
        [UserUpdateStatus.Started]: {
          text: "Updating...",
          className: [classes.statusUpdating],
        },
        [UserUpdateStatus.Success]: {
          text: "Updated",
          className: [classes.statusUpdated],
        },
        [UserUpdateStatus.Failure]: {
          text: "Update Fail",
          className: [classes.statusUpdateFailure],
        },
      }[updateStatus];
    }

    return null;
  };

  const statusParams = getParams();

  if (!statusParams) return null;

  return (
    <span className={cn(classes.userStatus, statusParams.className)}>
      {statusParams.text}
    </span>
  );
};
