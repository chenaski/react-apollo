import { gql } from "@apollo/client/core";

export const ErrorFragment = gql`
  fragment ErrorMessage on ErrorInterface {
    message
  }
`;
