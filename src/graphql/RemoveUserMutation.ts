import { gql } from "@apollo/client/core";

import { ErrorFragment } from "./ErrorFragment";
import { UserInfoFragment } from "./UserInfoFragment";

export const RemoveUserMutation = gql`
  mutation RemoveUser($userId: ID!) {
    removeUser(userId: $userId) {
      record {
        ...UserInfo
      }
      error {
        ...ErrorMessage
      }
    }
  }
  ${UserInfoFragment}
  ${ErrorFragment}
`;
