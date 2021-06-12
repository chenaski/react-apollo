import { gql } from "@apollo/client/core";

import { UserInfoFragment } from "./UserInfoFragment";

export const ChangeUsernameMutation = gql`
  mutation ChangeUsername(
    $userId: ID!
    $changeUsernameInput: ChangeUsernameInput!
  ) {
    changeUsername(userId: $userId, changeUsernameInput: $changeUsernameInput) {
      ...UserInfo
    }
  }
  ${UserInfoFragment}
`;
