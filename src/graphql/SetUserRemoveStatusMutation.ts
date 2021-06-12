import { gql } from "@apollo/client/core";

export const SetUserRemoveStatusMutation = gql`
  mutation setUserRemoveStatus($userId: ID!, $status: UserRemoveStatus!) {
    setUserRemoveStatus(userId: $userId, status: $status) @client
  }
`;
