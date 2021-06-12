import { gql } from "@apollo/client/core";

export const typeDefs = gql`
  directive @client on FIELD

  enum UserUpdateStatus {
    NONE
    STARTED
    SUCCESS
    FAILURE
  }

  enum UserRemoveStatus {
    NONE
    STARTED
    SUCCESS
    FAILURE
  }

  extend type Mutation {
    setUserUpdateStatus(userId: ID!, status: UserUpdateStatus!): Boolean!
    setUserRemoveStatus(userId: ID!, status: UserRemoveStatus!): Boolean!
  }

  extend type User {
    updateStatus: UserUpdateStatus!
    removeStatus: UserRemoveStatus!
  }
`;
