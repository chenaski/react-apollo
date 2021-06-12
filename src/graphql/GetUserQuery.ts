import { gql } from "@apollo/client/core";

import { UserInfoFragment } from "./UserInfoFragment";

export const GetUserQuery = gql`
  query GetUser($userId: ID!) {
    user(userId: $userId) {
      ...UserInfo
    }
  }
  ${UserInfoFragment}
`;
