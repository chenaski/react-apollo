import React, { ChangeEvent, FormEvent, MouseEvent } from "react";

import { useApolloClient } from "@apollo/client";

import {
  UpdateUserInput,
  useGetUserQuery,
  UserInfoFragment,
  UserUpdateStatus,
  useSetUserUpdateStatusMutation,
  useUpdateUserMutation,
  useUsersListQuery,
} from "../../generated/graphql";
import { GetUserQuery } from "../../graphql/GetUserQuery";

import classes from "./ChangeUserForm.module.css";

export interface ChangeUserProps {
  userId: string;
}

export const ChangeUserForm = ({ userId }: ChangeUserProps) => {
  const client = useApolloClient();
  const { data: usersListData } = useUsersListQuery();
  const {
    data: getUserData,
    loading: getUserLoading,
    error: getUserError,
  } = useGetUserQuery({
    variables: { id: userId },
  });
  const [setUserUpdateStatusMutation] = useSetUserUpdateStatusMutation();
  const [
    updateUserMutation,
    { loading: updateUserLoading, error: updateUserError },
  ] = useUpdateUserMutation({
    refetchQueries: [
      {
        query: GetUserQuery,
        variables: {
          id: userId,
        },
      },
    ],
    onCompleted: async () => {
      await setUserUpdateStatusMutation({
        variables: { id: userId, status: UserUpdateStatus.Finished },
      });
    },
  });

  const initialFormState = {
    username: "",
    name: "",
    email: "",
    password: "",
    friends: getUserData?.user?.friends.map(({ id }) => id) || [],
  };
  const [formData, setFormData] = React.useState(initialFormState);
  const [userBeforePreview, setUserBeforePreview] =
    React.useState<UserInfoFragment | null>(null);
  const resetFormToInitalState = ({
    user,
  }: {
    user: UserInfoFragment | null | undefined;
  }) => {
    if (user) {
      const { username, name, email, friends } = user;
      setFormData({
        username,
        name,
        email,
        password: "",
        friends: friends.map(({ id }) => id) || [],
      });
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

  const onChangeInput =
    (name: keyof UpdateUserInput) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [name]: e.target.value,
      });
    };
  const onChangeSelect =
    (name: keyof UpdateUserInput) => (e: ChangeEvent<HTMLSelectElement>) => {
      setFormData({
        ...formData,
        [name]: Array.from(e.target.selectedOptions, (option) => option.value),
      });
    };
  const getInputProps = (name: keyof UpdateUserInput) => ({
    value: formData[name],
    onChange: onChangeInput(name),
  });
  const getSelectProps = (name: keyof UpdateUserInput) => ({
    value: formData[name] as string[],
    onChange: onChangeSelect(name),
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUserBeforePreview(null);

    await setUserUpdateStatusMutation({
      variables: { id: userId, status: UserUpdateStatus.InProgress },
    });
    const { errors } = await updateUserMutation({
      variables: {
        id: userId,
        updateUserInput: formData,
      },
    });

    setStatus({ isSuccess: !!errors });
  };

  const handlePreviewButtonClick = () => {
    if (!getUserData?.user) return;

    setUserBeforePreview(getUserData.user);

    const getUsersByIds = (ids: string[]): UserInfoFragment[] => {
      return ids.reduce((users, id) => {
        const { user } = client.readQuery({
          query: GetUserQuery,
          variables: {
            id,
          },
        });

        if (!user) return users;

        return [...users, user];
      }, [] as UserInfoFragment[]);
    };

    client.writeQuery({
      query: GetUserQuery,
      variables: {
        id: userId,
      },
      data: {
        user: {
          ...getUserData.user,
          ...formData,
          friends: getUsersByIds(formData.friends),
        },
      },
    });
  };

  const resetForm = () => {
    resetFormToInitalState({ user: userBeforePreview || getUserData?.user });
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

        <label>
          Friends
          <select
            name={"new-friends"}
            multiple={true}
            {...getSelectProps("friends")}
          >
            {usersListData?.users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </label>

        <button disabled={updateUserLoading}>Save</button>
        <button
          type={"button"}
          className={classes.resetButton}
          onClick={resetForm}
          disabled={updateUserLoading}
        >
          Reset
        </button>
        <button
          type={"button"}
          className={classes.previewButton}
          onClick={handlePreviewButtonClick}
          disabled={updateUserLoading}
        >
          Preview
        </button>

        {isSuccess && <p>Successfully updated!</p>}
        {!!updateUserError && <p>{updateUserError}</p>}
      </form>
    </section>
  );
};
