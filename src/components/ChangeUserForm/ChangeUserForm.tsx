import React, { ChangeEvent, FormEvent, MouseEvent } from "react";
import classes from "./ChangeUserForm.module.css";
import {
  CreateUserInput,
  useGetUserQuery,
  UserInfoFragment,
  useUpdateUserMutation,
} from "../../generated/graphql";
import { GetUser } from "../../graphql/GetUser";

export interface ChangeUserProps {
  userId: string;
}

export const ChangeUserForm = ({ userId }: ChangeUserProps) => {
  const {
    data: getUserData,
    loading: getUserLoading,
    error: getUserError,
  } = useGetUserQuery({
    variables: { id: userId },
  });
  const [
    updateUserMutation,
    { loading: updateUserLoading, error: updateUserError },
  ] = useUpdateUserMutation({
    refetchQueries: [
      {
        query: GetUser,
        variables: {
          id: userId,
        },
      },
    ],
  });

  const initialFormState = {
    username: "",
    name: "",
    email: "",
    password: "",
  };
  const [formData, setFormData] = React.useState(initialFormState);
  const resetFormToInitalState = ({
    user,
  }: {
    user: UserInfoFragment | null | undefined;
  }) => {
    if (user) {
      const { username, name, email } = user;
      setFormData({ username, name, email, password: "" });
    } else {
      setFormData(initialFormState);
    }
  };

  React.useEffect(() => {
    resetFormToInitalState({ user: getUserData?.user });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserData?.user]);

  const [isSuccess, setIsSuccess] = React.useState<null | boolean>(false);
  const setStatus = ({ isSuccess }: { isSuccess: boolean }) => {
    setIsSuccess(isSuccess);

    setTimeout(() => {
      setIsSuccess(null);
    });
  };

  const onChange = (name: keyof CreateUserInput) => (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const getInputProps = (name: keyof CreateUserInput) => ({
    value: formData[name],
    onChange: onChange(name),
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { errors } = await updateUserMutation({
      variables: {
        id: userId,
        updateUserInput: formData,
      },
    });

    setStatus({ isSuccess: !!errors });
  };

  const resetForm = (e: MouseEvent<HTMLButtonElement>) => {
    resetFormToInitalState({ user: getUserData?.user });
  };

  if (getUserLoading) {
    return (
      <section>
        <h1>Profile</h1>

        <p>Loading...</p>
      </section>
    );
  } else if (getUserError?.message) {
    return (
      <section>
        <h1>Profile</h1>

        <p>{getUserError.message}</p>
      </section>
    );
  } else if (!getUserData?.user) {
    return null;
  }

  return (
    <section>
      <h1>Profile</h1>

      <form onSubmit={onSubmit}>
        <label>
          Username
          <input name={"new-username"} {...getInputProps("username")} />
        </label>

        <label>
          Name
          <input name={"new-name"} {...getInputProps("name")} />
        </label>

        <label>
          Email
          <input
            type={"email"}
            name={"new-email"}
            {...getInputProps("email")}
          />
        </label>

        <label>
          Password
          <input
            type={"password"}
            name={"new-password"}
            {...getInputProps("password")}
          />
        </label>

        <button disabled={updateUserLoading}>Save</button>
        <button
          type={"button"}
          className={classes.resetButton}
          onClick={resetForm}
        >
          Reset
        </button>

        {isSuccess && <p>Successfully updated!</p>}
        {!!updateUserError && <p>{updateUserError}</p>}
      </form>
    </section>
  );
};
