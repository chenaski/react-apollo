import { gql } from "@apollo/client/core";
import { UserInfoFragment } from "./UserInfoFragment";

export const GetUserQuery = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserInfo
    }
  }
  ${UserInfoFragment}
`;
