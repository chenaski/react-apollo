import { gql } from "@apollo/client/core";

import { UserInfoFragment } from "./UserInfoFragment";

export const UsersListQuery = gql`
  query UsersList($offset: Int!, $limit: Int!) {
    users: usersList(offset: $offset, limit: $limit) {
      ...UserInfo
    }
  }
  ${UserInfoFragment}
`;
