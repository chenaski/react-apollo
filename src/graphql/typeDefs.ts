import { gql } from "@apollo/client/core";

export const typeDefs = gql`
  directive @client on FIELD

  enum UserUpdateStatus {
    NONE
    IN_PROGRESS
    FINISHED
  }

  extend type Mutation {
    setUserUpdateStatus(id: ID!, status: UserUpdateStatus!): Boolean!
  }

  extend type User {
    updateStatus: UserUpdateStatus!
  }
`;
