import { gql } from "@apollo/client/core";

export const UserInfoFragment = gql`
  fragment UserInfo on User {
    id
    name
    username
    email
    friends {
      id
      name
    }
  }
`;
