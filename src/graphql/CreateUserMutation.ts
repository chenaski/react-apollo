import { gql } from "@apollo/client/core";

import { ErrorFragment } from "./ErrorFragment";
import { UserInfoFragment } from "./UserInfoFragment";

export const CreateUserMutation = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      record {
        ...UserInfo
      }
      errors {
        ...Errors
      }
    }
  }
  ${UserInfoFragment}
  ${ErrorFragment}
`;
