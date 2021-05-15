import { gql } from "@apollo/client/core";
import { UserInfoFragment } from "./UserInfoFragment";

export const UpdateUserMutation = gql`
  mutation UpdateUser($id: ID!, $updateUserInput: UpdateUserInput!) {
    updateUser(id: $id, updateUserInput: $updateUserInput) {
      ...UserInfo
    }
  }
  ${UserInfoFragment}
`;
