import React from "react";

import { ErrorMessageFragment } from "../../generated/graphql";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { RemoveUserButton } from "../RemoveUserButton";

import classes from "./RemoveUser.module.css";

export interface RemoveUserProps {
  userId: string;
  onRemoveUser: () => void;
}

export const RemoveUser = ({ userId, onRemoveUser }: RemoveUserProps) => {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const commonButtonProps = {
    userId,
    onSuccess: onRemoveUser,
    onError: (error: ErrorMessageFragment) => {
      setErrorMessage(error.message);

      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    },
  };

  return (
    <section>
      <h2 className={classes.formTitle}>Remove User</h2>

      <ErrorMessage className={classes.errorMessage}>
        {errorMessage}
      </ErrorMessage>

      <div className={classes.buttons}>
        <RemoveUserButton {...commonButtonProps}>Remove User</RemoveUserButton>

        <RemoveUserButton {...commonButtonProps} updatePolicy={"refetch"}>
          Remove User - Refetch
        </RemoveUserButton>

        <RemoveUserButton
          {...commonButtonProps}
          updatePolicy={"cacheUpdate"}
          cacheUpdateTarget={"list"}
        >
          Remove User - writeQuery (Users List)
        </RemoveUserButton>

        <RemoveUserButton
          {...commonButtonProps}
          updatePolicy={"cacheUpdate"}
          cacheUpdateTarget={"item"}
        >
          Remove User - writeQuery (User)
        </RemoveUserButton>

        <RemoveUserButton
          {...commonButtonProps}
          updatePolicy={"cacheUpdate"}
          cacheUpdateTarget={"listAndItem"}
        >
          Remove User - writeQuery (Users List & User)
        </RemoveUserButton>
      </div>
    </section>
  );
};
