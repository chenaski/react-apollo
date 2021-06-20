import { gql } from "@apollo/client/core";

export const ServerActionPerformedSubscription = gql`
  subscription ServerActionPerformed {
    serverActionPerformed {
      date
      message
    }
  }
`;
