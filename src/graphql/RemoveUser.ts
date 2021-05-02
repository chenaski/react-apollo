import { gql } from "@apollo/client/core";

export const RemoveUser = gql`
  mutation RemoveUser($id: ID!) {
    removeUser(id: $id)
  }
`;
