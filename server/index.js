const { createServer } = require("http");
const express = require("express");
const cors = require("cors");
const { execute, subscribe } = require("graphql");
const { ApolloServer, gql } = require("apollo-server-express");
const DataLoader = require("dataloader");
const { PubSub } = require("graphql-subscriptions");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");

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
    createdAt: String!
    updatedAt: String!
  }

  type UsersPaginatedList {
    users: [User!]!
    usersCountBefore: Int!
    nextCursor: Cursor
    prevCursor: Cursor
  }

  type Cursor {
    id: ID!
    createdAt: String!
  }

  input CreateUserInput {
    username: String!
  }

  type CreateUserPayload {
    record: User
    error: ErrorInterface
  }

  input ChangeUsernameInput {
    username: String!
  }

  type ChangeUsernamePayload {
    record: User
    error: ErrorInterface
  }

  type RemoveUserPayload {
    record: User
    error: ErrorInterface
  }

  type ServerAction {
    date: String!
    message: String!
  }

  interface ErrorInterface {
    message: String!
  }

  type ServerError implements ErrorInterface {
    message: String!
  }

  type ValidationError implements ErrorInterface {
    message: String!
    field: String!
  }

  input CursorInput {
    id: ID!
    createdAt: String!
  }

  type Query {
    users: [User!]!
    usersList(offset: Int!, limit: Int!): [User!]!
    usersListWithCursor(cursor: CursorInput, limit: Int!): UsersPaginatedList!
    user(userId: ID!): User
  }

  type Mutation {
    createUser(createUserInput: CreateUserInput!): CreateUserPayload
    removeUser(userId: ID!): RemoveUserPayload
    changeUsername(
      userId: ID!
      changeUsernameInput: ChangeUsernameInput!
    ): ChangeUsernamePayload
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    usersList: (_, { offset, limit }) => {
      return sleep(db.users.slice(offset, offset + limit));
    },
    usersListWithCursor: (_, { cursor, limit }) => {
      const sortedUsers = db.users
        .sort((user1, user2) => user1.id - user2.id)
        .sort(
          (user1, user2) =>
            new Date(user1.createdAt) - new Date(user2.createdAt)
        );

      if (!cursor) {
        const { id, createdAt } = sortedUsers[0];
        cursor = { id, createdAt };
      }

      const userIndex = db.users.findIndex(
        (user) => user.createdAt === cursor.createdAt && user.id === cursor.id
      );
      const prevUser =
        userIndex >= limit ? sortedUsers[userIndex - limit] : null;
      const prevCursor = prevUser
        ? { id: prevUser.id, createdAt: prevUser.createdAt }
        : null;
      const nextUser =
        userIndex + limit < sortedUsers.length
          ? sortedUsers[userIndex + limit]
          : null;
      const nextCursor = nextUser
        ? { id: nextUser.id, createdAt: nextUser.createdAt }
        : null;
      const usersList = db.users.slice(userIndex, userIndex + limit);

      return sleep({
        nextCursor,
        prevCursor,
        users: usersList,
        usersCountBefore: userIndex + limit,
      });
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
  ErrorInterface: {
    __resolveType: (obj) => {
      if (obj.field) {
        return "ValidationError";
      }

      return "ServerError";
    },
  },
  Mutation: {
    createUser: async (_, { createUserInput }) => {
      await sleep(onServerActionPerformed("Start user creation"));

      if (createUserInput.username === "") {
        return sleep({
          error: {
            message: "`Username` must be at least one character",
            field: "username",
          },
        });
      }

      if (db.users.find((user) => user.username === createUserInput.username)) {
        return sleep({
          error: {
            message: `User with username "${createUserInput.username}" already exists`,
          },
        });
      }

      const createdUser = {
        id: db.users.length.toString(),
        friends: [],
        ...createUserInput,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await sleep(onServerActionPerformed("User object created"));

      db.users.push(createdUser);

      await sleep(onServerActionPerformed("User added to `db.users`"));

      return sleep({ record: createdUser });
    },
    removeUser: async (_, { userId }) => {
      await sleep(onServerActionPerformed("Start user deleting"));

      const removedUser = db.users.find((user) => userId === user.id);

      if (!removedUser) {
        return {
          error: {
            message: `User with id "${userId}" not found`,
          },
        };
      }

      await sleep(onServerActionPerformed("User found in `db.users`"));

      db.users = db.users.filter((user) => userId !== user.id);

      await sleep(onServerActionPerformed("User deleted from `db.users`"));

      userLoader.clear(userId);

      await sleep(onServerActionPerformed("User deleted from cache"));

      return sleep({ record: removedUser });
    },
    changeUsername: (_, { userId, changeUsernameInput }) => {
      if (changeUsernameInput.username === "") {
        return sleep({
          error: {
            message: "`Username` must be at least one character",
            field: "username",
          },
        });
      }

      const user = db.users.find((user) => userId === user.id);

      if (!user) {
        return {
          error: {
            message: `User with id "${userId}" not found`,
          },
        };
      }

      const updatedUser = {
        ...user,
        ...changeUsernameInput,
        updatedAt: new Date().toISOString(),
      };

      db.users = db.users.filter((user) => userId !== user.id);
      db.users.unshift(updatedUser);

      userLoader.clear(userId);
      return sleep({ record: updatedUser }, 3000);
    },
  },
  Subscription: {
    serverActionPerformed: {
      subscribe: () => pubsub.asyncIterator([SERVER_ACTION_PERFORMED]),
    },
  },
};

(async () => {
  const app = express();

  app.use(cors());

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    schema,
  });
  await server.start();
  server.applyMiddleware({ app, path: "/" });

  SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: "/subscriptions" }
  );

  const PORT = process.env.SERVER_PORT;
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/`)
  );
})();
