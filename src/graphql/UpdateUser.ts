import { gql } from "@apollo/client/core";
import { UserInfo } from "./UserInfo";

export const UpdateUser = gql`
  mutation UpdateUser($id: ID!, $updateUserInput: UpdateUserInput!) {
    updateUser(id: $id, updateUserInput: $updateUserInput) {
      ...UserInfo
    }
  }
  ${UserInfo}
`;
