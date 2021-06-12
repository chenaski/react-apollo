import { gql } from "@apollo/client/core";

import { UserInfoFragment } from "./UserInfoFragment";

export const RemoveUserMutation = gql`
  mutation RemoveUser($userId: ID!) {
    removeUser(userId: $userId) {
      ...UserInfo
    }
  }
  ${UserInfoFragment}
`;
