import React from "react";

import { useGetUserQuery } from "../../generated/graphql";
import { ChangeUserButton } from "../ChangeUserButton";

import classes from "./ChangeUser.module.css";

export interface ChangeUserProps {
  userId: string;
}

export const ChangeUser = ({ userId }: ChangeUserProps) => {
  const { data, loading, error } = useGetUserQuery({ variables: { userId } });
  const [username, setUsername] = React.useState(data?.user?.username || "");

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

      <div className={classes.buttons}>
        <ChangeUserButton {...commonButtonProps} username={username}>
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
