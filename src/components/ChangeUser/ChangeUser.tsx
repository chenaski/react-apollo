import React from "react";

import { ErrorMessageFragment, useGetUserQuery } from "../../generated/graphql";
import { ChangeUserButton } from "../ChangeUserButton/ChangeUserButton";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";

import classes from "./ChangeUser.module.css";

export interface ChangeUserProps {
  userId: string;
}

export const ChangeUser = ({ userId }: ChangeUserProps) => {
  const { data, loading, error } = useGetUserQuery({ variables: { userId } });
  const [username, setUsername] = React.useState(data?.user?.username || "");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    setUsername(data?.user?.username || "");
  }, [data?.user?.username]);

  if (loading) {
    return <p>Loading ...</p>;
  } else if (error) {
    return <p>{error.message}</p>;
  } else if (!data?.user) {
    return null;
  }

  const commonButtonProps = {
    userId,
    username,
    onSuccess: (updatedUsername?: string) =>
      setUsername(updatedUsername || username),
    onError: (error: ErrorMessageFragment) => {
      setErrorMessage(error.message);

      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    },
  };

  return (
    <section>
      <h2 className={classes.formTitle}>Change User</h2>
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
        <ChangeUserButton
          {...commonButtonProps}
          username={username}
          optimistic={true}
        >
          Change User - API
        </ChangeUserButton>

        <ChangeUserButton {...commonButtonProps} cacheOnly={"writeQuery"}>
          Change User - writeQuery
        </ChangeUserButton>

        <ChangeUserButton {...commonButtonProps} cacheOnly={"writeFragment"}>
          Change User - writeFragment
        </ChangeUserButton>
      </div>
    </section>
  );
};
