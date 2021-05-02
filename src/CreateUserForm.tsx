import React, { ChangeEvent, FormEvent } from "react";
import { CreateUserInput, useCreateUserMutation } from "./generated/graphql";
import { UsersList } from "./graphql/UsersList";

export const CreateUserForm = () => {
  const [createUserMutation, { loading, error }] = useCreateUserMutation({
    refetchQueries: [{ query: UsersList }],
  });

  const initialFormState = {
    username: "",
    name: "",
    email: "",
    password: "",
  };
  const [formData, setFormData] = React.useState(initialFormState);

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

        <button disabled={loading}>Create</button>

        {!!error && <p>{error}</p>}
      </form>
    </section>
  );
};
