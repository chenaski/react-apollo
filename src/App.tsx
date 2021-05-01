import React from "react";
import "./App.css";
import { gql } from "@apollo/client/core";
import { useUsersQuery } from "./generated/graphql";

const USER_FRAGMENT_GQL = gql`
  fragment UserInfo on User {
    id
    name
    username
    email
  }
`;

const USERS_GQL = gql`
  query users {
    users {
      ...UserInfo
    }
  }
  ${USER_FRAGMENT_GQL}
`;

const USER_GQL = gql`
  query user($id: ID!) {
    user(id: $id) {
      ...UserInfo
    }
  }
  ${USER_FRAGMENT_GQL}
`;

const CREATE_USER_GQL = gql`
  mutation createUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      ...UserInfo
    }
  }
  ${USER_FRAGMENT_GQL}
`;

const REMOVE_USER_GQL = gql`
  mutation removeUser($id: ID!) {
    removeUser(id: $id)
  }
`;

const UPDATE_USER_GQL = gql`
  mutation updateUser($id: ID!, $updateUserInput: UpdateUserInput!) {
    updateUser(id: $id, updateUserInput: $updateUserInput) {
      ...UserInfo
    }
  }
  ${USER_FRAGMENT_GQL}
`;

function App() {
  const { data, loading, error } = useUsersQuery();

  return (
    <div className="App">
      {loading ? (
        <p>Loading...</p>
      ) : data?.users.length ? (
        <ul>
          {data.users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      ) : (
        <p>There is no data available</p>
      )}

      {!!error && <p>{error}</p>}
    </div>
  );
}

export default App;
