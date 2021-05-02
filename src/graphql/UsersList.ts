import { gql } from "@apollo/client/core";
import { UserInfo } from "./UserInfo";

export const UsersList = gql`
  query UsersList {
    users {
      ...UserInfo
    }
  }
  ${UserInfo}
`;
