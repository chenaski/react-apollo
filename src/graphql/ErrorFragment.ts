import { gql } from "@apollo/client/core";

export const ErrorFragment = gql`
  fragment Errors on Error {
    ... on ValidationError {
      field
      message
    }
    ... on ServerError {
      message
    }
  }
`;
