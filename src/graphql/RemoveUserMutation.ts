import { gql } from "@apollo/client/core";

import { UserInfoFragment } from "./UserInfoFragment";

export const RemoveUserMutation = gql`
  mutation RemoveUser($id: ID!) {
    removeUser(id: $id) {
      ...UserInfo
    }
  }
  ${UserInfoFragment}
`;
