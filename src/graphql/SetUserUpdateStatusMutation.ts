import { gql } from "@apollo/client/core";

export const SetUserUpdateStatusMutation = gql`
  mutation setUserUpdateStatus($userId: ID!, $status: UserUpdateStatus!) {
    setUserUpdateStatus(userId: $userId, status: $status) @client
  }
`;
