import { gql } from "@apollo/client/core";

import { UserInfoFragment } from "./UserInfoFragment";

export const UsersListWithCursorQuery = gql`
  query UsersListWithCursor($cursor: CursorInput, $limit: Int!) {
    usersListWithCursor(cursor: $cursor, limit: $limit) {
      users {
        ...UserInfo
      }
      usersCountBefore
      nextCursor {
        id
        createdAt
      }
      prevCursor {
        id
        createdAt
      }
    }
  }
  ${UserInfoFragment}
`;
