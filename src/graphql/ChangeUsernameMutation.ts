import { gql } from "@apollo/client/core";

import { ErrorFragment } from "./ErrorFragment";
import { UserInfoFragment } from "./UserInfoFragment";

export const ChangeUsernameMutation = gql`
  mutation ChangeUsername(
    $userId: ID!
    $changeUsernameInput: ChangeUsernameInput!
  ) {
    changeUsername(userId: $userId, changeUsernameInput: $changeUsernameInput) {
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
