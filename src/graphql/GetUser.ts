import { gql } from "@apollo/client/core";
import { UserInfo } from "./UserInfo";

export const GetUser = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserInfo
    }
  }
  ${UserInfo}
`;
