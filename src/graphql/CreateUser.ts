import { gql } from "@apollo/client/core";
import { UserInfo } from "./UserInfo";

export const CreateUser = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      ...UserInfo
    }
  }
  ${UserInfo}
`;
