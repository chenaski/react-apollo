import { gql } from "@apollo/client/core";

export const SetUserUpdateStatusMutation = gql`
  mutation setUserUpdateStatus($id: ID!, $status: UserUpdateStatus!) {
    setUserUpdateStatus(id: $id, status: $status) @client
  }
`;
