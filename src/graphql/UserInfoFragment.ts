import { gql } from "@apollo/client/core";

export const UserInfoFragment = gql`
  fragment UserInfo on User {
    id
    username
    friends {
      id
      username
    }
    updateStatus @client
    removeStatus @client
  }
`;
