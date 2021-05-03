const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    username: String!
    email: String!
    password: String!
  }

  input CreateUserInput {
    name: String!
    username: String!
    email: String!
    password: String!
  }

  input UpdateUserInput {
    name: String
    username: String
    email: String
    password: String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(createUserInput: CreateUserInput!): User
    removeUser(id: ID!): Boolean
    updateUser(id: ID!, updateUserInput: UpdateUserInput!): User
  }
`;

const db = {
  users: [],
};

const resolvers = {
  Query: {
    users: () => db.users,
    user: (_, { id }) => db.users.find((user) => id === user.id),
  },
  Mutation: {
    createUser: (_, { createUserInput }) => {
      const createdUser = {
        id: db.users.length.toString(),
        ...createUserInput,
      };

      db.users.push(createdUser);

      return createdUser;
    },
    removeUser: (_, { id }) => {
      db.users = db.users.filter((user) => id !== user.id);

      return true;
    },
    updateUser: (_, { id, updateUserInput }) => {
      const user = db.users.find((user) => id === user.id);
      const updatedUser = { ...user, ...updateUserInput };

      db.users = db.users.filter((user) => id !== user.id);
      db.users.unshift(updatedUser);

      return updatedUser;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: process.env.SERVER_PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
