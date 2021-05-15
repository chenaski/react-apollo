import { gql } from "@apollo/client/core";

export const typeDefs = gql`
  directive @client on FIELD

  extend type Mutation {
    setIsUserChanged(id: ID!, isChanged: Boolean!): Boolean!
  }

  extend type User {
    isChanged: Boolean!
  }
`;
