const { ApolloServer, gql } = require("apollo-server");
const DataLoader = require("dataloader");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    friends: [User!]!
  }

  input CreateUserInput {
    username: String!
  }

  input ChangeUsernameInput {
    username: String!
  }

  type Query {
    users: [User!]!
    user(userId: ID!): User
  }

  type Mutation {
    createUser(createUserInput: CreateUserInput!): User
    removeUser(userId: ID!): User
    changeUsername(userId: ID!, changeUsernameInput: ChangeUsernameInput!): User
  }
`;

const generateUser = ({ id }) => {
  const generateRandomString = () => Math.random().toString(36).substr(2, 5);
  const generateRandomNumber = ({ min, max, excluded } = {}) => {
    if (!min) min = 0;
    if (!excluded) excluded = [];

    const randomNumber = Math.abs(
      Math.round(min - 0.5 + Math.random() * (max - min + 1))
    );

    return excluded.includes(randomNumber)
      ? generateRandomNumber({ min, max, excluded })
      : randomNumber;
  };

  const excludedFriendsIds = [id];

  return {
    id,
    username: generateRandomString(),
    friends: new Array(1).fill(0).map(() => {
      const friendId = generateRandomNumber({
        max: 2,
        excluded: excludedFriendsIds.map((id) => +id),
      });

      excludedFriendsIds.push(friendId.toString());

      return friendId.toString();
    }),
  };
};

const getMockUsers = () => {
  return new Array(3)
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
    user: async (_, { userId }) => {
      return sleep(await userLoader.load(userId));
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
        friends: [],
        ...createUserInput,
      };

      db.users.push(createdUser);

      return sleep(createdUser);
    },
    removeUser: (_, { userId }) => {
      const removedUser = db.users.find((user) => userId === user.id);
      db.users = db.users.filter((user) => userId !== user.id);

      userLoader.clear(userId);
      return sleep(removedUser);
    },
    changeUsername: (_, { userId, changeUsernameInput }) => {
      const user = db.users.find((user) => userId === user.id);
      const updatedUser = { ...user, ...changeUsernameInput };

      db.users = db.users.filter((user) => userId !== user.id);
      db.users.unshift(updatedUser);

      userLoader.clear(userId);
      return sleep(updatedUser, 3000);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: process.env.SERVER_PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
