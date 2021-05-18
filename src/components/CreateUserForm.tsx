import React, { ChangeEvent, FormEvent } from "react";

import {
  CreateUserInput,
  useCreateUserMutation,
  useUsersListQuery,
} from "../generated/graphql";
import { UsersListQuery } from "../graphql/UsersListQuery";

export const CreateUserForm = () => {
  const { data: usersListData } = useUsersListQuery();
  const [createUserMutation, { loading, error }] = useCreateUserMutation({
    refetchQueries: [{ query: UsersListQuery }],
  });

  const initialFormState = {
    username: "",
    name: "",
    email: "",
    password: "",
    friends: [],
  };
  const [formData, setFormData] = React.useState(initialFormState);

  const onChangeInput =
    (name: keyof CreateUserInput) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [name]: e.target.value,
      });
    };
  const onChangeSelect =
    (name: keyof CreateUserInput) => (e: ChangeEvent<HTMLSelectElement>) => {
      setFormData({
        ...formData,
        [name]: Array.from(e.target.selectedOptions, (option) => option.value),
      });
    };
  const getInputProps = (name: keyof CreateUserInput) => ({
    value: formData[name],
    onChange: onChangeInput(name),
  });
  const getSelectProps = (name: keyof CreateUserInput) => ({
    value: formData[name] as string[],
    onChange: onChangeSelect(name),
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await createUserMutation({
      variables: {
        createUserInput: formData,
      },
    });

    setFormData(initialFormState);
  };

  return (
    <section>
      <h1>Create User</h1>

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

        <button disabled={loading}>Create</button>

        {!!error && <p>{error}</p>}
      </form>
    </section>
  );
};
