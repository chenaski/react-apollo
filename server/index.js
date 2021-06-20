const { ApolloServer, gql } = require("apollo-server");
const DataLoader = require("dataloader");
const { PubSub } = require("apollo-server");

const pubsub = new PubSub();

const SERVER_ACTION_PERFORMED = "SERVER_ACTION_PERFORMED";

const onServerActionPerformed = (message) => {
  return pubsub.publish(SERVER_ACTION_PERFORMED, {
    serverActionPerformed: {
      date: new Date().toISOString(),
      message,
    },
  });
};

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

  type ServerAction {
    date: String!
    message: String!
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

  type Subscription {
    serverActionPerformed: ServerAction
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
    createUser: async (_, { createUserInput }) => {
      await sleep(onServerActionPerformed("Start user creation"));

      const createdUser = {
        id: db.users.length.toString(),
        friends: [],
        ...createUserInput,
      };

      await sleep(onServerActionPerformed("User object created"));

      db.users.push(createdUser);

      await sleep(onServerActionPerformed("User added to `db.users`"));

      return sleep(createdUser);
    },
    removeUser: async (_, { userId }) => {
      await sleep(onServerActionPerformed("Start user deleting"));

      const removedUser = db.users.find((user) => userId === user.id);

      await sleep(onServerActionPerformed("User found in `db.users`"));

      db.users = db.users.filter((user) => userId !== user.id);

      await sleep(onServerActionPerformed("User deleted from `db.users`"));

      userLoader.clear(userId);

      await sleep(onServerActionPerformed("User deleted from cache"));

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
  Subscription: {
    serverActionPerformed: {
      subscribe: () => pubsub.asyncIterator([SERVER_ACTION_PERFORMED]),
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    path: "/subscriptions",
  },
});

server.listen({ port: process.env.SERVER_PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
