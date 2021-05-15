import { gql } from "@apollo/client/core";

export const SetIsUserChangedMutation = gql`
  mutation setIsUserChanged($id: ID!, $isChanged: Boolean!) {
    setIsUserChanged(id: $id, isChanged: $isChanged) @client
  }
`;
