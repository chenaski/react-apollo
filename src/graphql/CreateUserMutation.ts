import { gql } from "@apollo/client/core";

import { UserInfoFragment } from "./UserInfoFragment";

export const CreateUserMutation = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      ...UserInfo
    }
  }
  ${UserInfoFragment}
`;
