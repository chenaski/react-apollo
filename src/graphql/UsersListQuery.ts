import { gql } from "@apollo/client/core";

import { UserInfoFragment } from "./UserInfoFragment";

export const UsersListQuery = gql`
  query UsersList {
    users {
      ...UserInfo
    }
  }
  ${UserInfoFragment}
`;
