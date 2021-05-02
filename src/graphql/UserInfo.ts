import { gql } from "@apollo/client/core";

export const UserInfo = gql`
  fragment UserInfo on User {
    id
    name
    username
    email
  }
`;
