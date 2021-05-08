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
    removeUser(id: ID!): User
    updateUser(id: ID!, updateUserInput: UpdateUserInput!): User
  }
`;

const generateUser = () => {
  const generateRandomString = () => Math.random().toString(36).substr(2, 5);

  return {
    id: generateRandomString(),
    name: generateRandomString(),
    username: generateRandomString(),
    email: generateRandomString(),
    password: generateRandomString(),
  };
};
const getMockUsers = () => {
  return new Array(100).fill(0).map(generateUser);
};

const db = {
  users: getMockUsers(),
};

const sleep = (result, ms = 5000) => {
  return new Promise((resolve) => setTimeout(() => resolve(result), ms));
};

const resolvers = {
  Query: {
    users: () => sleep(db.users),
    user: (_, { id }) => sleep(db.users.find((user) => id === user.id)),
  },
  Mutation: {
    createUser: (_, { createUserInput }) => {
      const createdUser = {
        id: db.users.length.toString(),
        ...createUserInput,
      };

      db.users.push(createdUser);

      return sleep(createdUser);
    },
    removeUser: (_, { id }) => {
      const removedUser = db.users.find((user) => id === user.id);
      db.users = db.users.filter((user) => id !== user.id);

      return sleep(removedUser);
    },
    updateUser: (_, { id, updateUserInput }) => {
      const user = db.users.find((user) => id === user.id);
      const updatedUser = { ...user, ...updateUserInput };

      db.users = db.users.filter((user) => id !== user.id);
      db.users.unshift(updatedUser);

      return sleep(updatedUser);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: process.env.SERVER_PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
