const { ApolloServer, gql } = require("apollo-server");
const DataLoader = require("dataloader");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    username: String!
    email: String!
    password: String!
    friends: [User!]!
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
    friends: [ID!]!
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

const generateUser = ({ id }) => {
  const generateRandomString = () => Math.random().toString(36).substr(2, 5);
  const generateEmail = () => {
    return `${generateRandomString()}@${generateRandomString()}`;
  };
  const generateRandomNumber = ({ min, max, excluded } = {}) => {
    if (!min) min = 0;
    if (!excluded) excluded = [];

    const randomNumber = Math.round(
      min - 0.5 + Math.random() * (max - min + 1)
    );

    return excluded.includes(randomNumber)
      ? generateRandomNumber({ min, max, excluded })
      : randomNumber;
  };

  const excludedFriendsIds = [];

  return {
    id,
    name: generateRandomString(),
    username: generateRandomString(),
    email: generateEmail(),
    password: generateRandomString(),
    friends: new Array(10).fill(0).map(() => {
      const friendId = generateRandomNumber({
        max: 99,
        excluded: excludedFriendsIds,
      });

      excludedFriendsIds.push(friendId);

      return friendId.toString();
    }),
  };
};

const getMockUsers = () => {
  return new Array(100)
    .fill(0)
    .map((_, index) => generateUser({ id: index.toString() }));
};

const db = {
  users: getMockUsers(),
};

const sleep = (result, ms = 1000) => {
  return new Promise((resolve) => setTimeout(() => resolve(result), ms));
};

const userLoader = new DataLoader((ids) => {
  console.log("Load Users:", ids);
  return Promise.resolve(
    ids.map((id) => db.users.find((user) => id === user.id))
  );
});

const resolvers = {
  Query: {
    users: () => {
      return sleep(db.users);
    },
    user: async (_, { id }) => {
      return sleep(await userLoader.load(id));
    },
  },
  User: {
    friends: (user) => {
      return db.users.filter((dbUser) => user.friends.includes(dbUser.id));
    },
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

      userLoader.clear(id);
      return sleep(removedUser);
    },
    updateUser: (_, { id, updateUserInput }) => {
      const user = db.users.find((user) => id === user.id);
      const updatedUser = { ...user, ...updateUserInput };

      db.users = db.users.filter((user) => id !== user.id);
      db.users.unshift(updatedUser);

      userLoader.clear(id);
      return sleep(updatedUser, 3000);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: process.env.SERVER_PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
