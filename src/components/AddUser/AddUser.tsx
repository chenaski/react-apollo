import React from "react";

import { ErrorMessageFragment } from "../../generated/graphql";
import { AddUserButton } from "../AddUserButton";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";

import classes from "./AddUser.module.css";

export const AddUser = () => {
  const [username, setUsername] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const commonButtonProps = {
    username,
    onSuccess: () => setUsername(""),
    onError: (error: ErrorMessageFragment) => {
      setErrorMessage(error.message);

      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    },
  };

  return (
    <section>
      <h2 className={classes.formTitle}>Add User</h2>
      <form className={classes.form} onSubmit={(e) => e.preventDefault()}>
        <label>
          Username:
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
      </form>

      <ErrorMessage className={classes.errorMessage}>
        {errorMessage}
      </ErrorMessage>

      <div className={classes.buttons}>
        <AddUserButton {...commonButtonProps}>Add User</AddUserButton>

        <AddUserButton {...commonButtonProps} updatePolicy={"refetch"}>
          Add User - Refetch
        </AddUserButton>

        <AddUserButton
          {...commonButtonProps}
          updatePolicy={"cacheUpdate"}
          cacheUpdateTarget={"list"}
        >
          Add User - writeQuery (Users List)
        </AddUserButton>

        <AddUserButton
          {...commonButtonProps}
          updatePolicy={"cacheUpdate"}
          cacheUpdateTarget={"item"}
        >
          Add User - writeQuery (User)
        </AddUserButton>

        <AddUserButton
          {...commonButtonProps}
          updatePolicy={"cacheUpdate"}
          cacheUpdateTarget={"listAndItem"}
        >
          Add User - writeQuery (Users List & User)
        </AddUserButton>
      </div>
    </section>
  );
};
