import { gql } from "@apollo/client/core";
import { UserInfo } from "./UserInfo";

export const RemoveUser = gql`
  mutation RemoveUser($id: ID!) {
    removeUser(id: $id) {
      ...UserInfo
    }
  }
  ${UserInfo}
`;
