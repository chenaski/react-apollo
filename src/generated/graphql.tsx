import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export enum CacheControlScope {
  Public = "PUBLIC",
  Private = "PRIVATE",
}

export type ChangeUsernameInput = {
  username: Scalars["String"];
};

export type ChangeUsernamePayload = {
  __typename?: "ChangeUsernamePayload";
  record?: Maybe<User>;
  errors?: Maybe<Array<Error>>;
};

export type CreateUserInput = {
  username: Scalars["String"];
};

export type CreateUserPayload = {
  __typename?: "CreateUserPayload";
  record?: Maybe<User>;
  errors?: Maybe<Array<Error>>;
};

export type Error = ServerError | ValidationError;

export type Mutation = {
  __typename?: "Mutation";
  changeUsername?: Maybe<ChangeUsernamePayload>;
  createUser?: Maybe<CreateUserPayload>;
  removeUser?: Maybe<RemoveUserPayload>;
  setUserRemoveStatus: Scalars["Boolean"];
  setUserUpdateStatus: Scalars["Boolean"];
};

export type MutationChangeUsernameArgs = {
  userId: Scalars["ID"];
  changeUsernameInput: ChangeUsernameInput;
};

export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};

export type MutationRemoveUserArgs = {
  userId: Scalars["ID"];
};

export type MutationSetUserRemoveStatusArgs = {
  userId: Scalars["ID"];
  status: UserRemoveStatus;
};

export type MutationSetUserUpdateStatusArgs = {
  userId: Scalars["ID"];
  status: UserUpdateStatus;
};

export type Query = {
  __typename?: "Query";
  users: Array<User>;
  user?: Maybe<User>;
};

export type QueryUserArgs = {
  userId: Scalars["ID"];
};

export type RemoveUserPayload = {
  __typename?: "RemoveUserPayload";
  record?: Maybe<User>;
  errors?: Maybe<Array<Error>>;
};

export type ServerAction = {
  __typename?: "ServerAction";
  date: Scalars["String"];
  message: Scalars["String"];
};

export type ServerError = {
  __typename?: "ServerError";
  message: Scalars["String"];
};

export type Subscription = {
  __typename?: "Subscription";
  serverActionPerformed?: Maybe<ServerAction>;
};

export type User = {
  __typename?: "User";
  friends: Array<User>;
  id: Scalars["ID"];
  removeStatus: UserRemoveStatus;
  updateStatus: UserUpdateStatus;
  username: Scalars["String"];
};

export enum UserRemoveStatus {
  None = "NONE",
  Started = "STARTED",
  Success = "SUCCESS",
  Failure = "FAILURE",
}

export enum UserUpdateStatus {
  None = "NONE",
  Started = "STARTED",
  Success = "SUCCESS",
  Failure = "FAILURE",
}

export type ValidationError = {
  __typename?: "ValidationError";
  message: Scalars["String"];
  field: Scalars["String"];
};

export type ChangeUsernameMutationVariables = Exact<{
  userId: Scalars["ID"];
  changeUsernameInput: ChangeUsernameInput;
}>;

export type ChangeUsernameMutation = { __typename?: "Mutation" } & {
  changeUsername?: Maybe<
    { __typename?: "ChangeUsernamePayload" } & {
      record?: Maybe<{ __typename?: "User" } & UserInfoFragment>;
      errors?: Maybe<
        Array<
          | ({ __typename?: "ServerError" } & Errors_ServerError_Fragment)
          | ({
              __typename?: "ValidationError";
            } & Errors_ValidationError_Fragment)
        >
      >;
    }
  >;
};

export type CreateUserMutationVariables = Exact<{
  createUserInput: CreateUserInput;
}>;

export type CreateUserMutation = { __typename?: "Mutation" } & {
  createUser?: Maybe<
    { __typename?: "CreateUserPayload" } & {
      record?: Maybe<{ __typename?: "User" } & UserInfoFragment>;
      errors?: Maybe<
        Array<
          | ({ __typename?: "ServerError" } & Errors_ServerError_Fragment)
          | ({
              __typename?: "ValidationError";
            } & Errors_ValidationError_Fragment)
        >
      >;
    }
  >;
};

type Errors_ServerError_Fragment = { __typename?: "ServerError" } & Pick<
  ServerError,
  "message"
>;

type Errors_ValidationError_Fragment = {
  __typename?: "ValidationError";
} & Pick<ValidationError, "field" | "message">;

export type ErrorsFragment =
  | Errors_ServerError_Fragment
  | Errors_ValidationError_Fragment;

export type GetUserQueryVariables = Exact<{
  userId: Scalars["ID"];
}>;

export type GetUserQuery = { __typename?: "Query" } & {
  user?: Maybe<{ __typename?: "User" } & UserInfoFragment>;
};

export type RemoveUserMutationVariables = Exact<{
  userId: Scalars["ID"];
}>;

export type RemoveUserMutation = { __typename?: "Mutation" } & {
  removeUser?: Maybe<
    { __typename?: "RemoveUserPayload" } & {
      record?: Maybe<{ __typename?: "User" } & UserInfoFragment>;
      errors?: Maybe<
        Array<
          | ({ __typename?: "ServerError" } & Errors_ServerError_Fragment)
          | ({
              __typename?: "ValidationError";
            } & Errors_ValidationError_Fragment)
        >
      >;
    }
  >;
};

export type ServerActionPerformedSubscriptionVariables = Exact<{
  [key: string]: never;
}>;

export type ServerActionPerformedSubscription = {
  __typename?: "Subscription";
} & {
  serverActionPerformed?: Maybe<
    { __typename?: "ServerAction" } & Pick<ServerAction, "date" | "message">
  >;
};

export type SetUserRemoveStatusMutationVariables = Exact<{
  userId: Scalars["ID"];
  status: UserRemoveStatus;
}>;

export type SetUserRemoveStatusMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "setUserRemoveStatus"
>;

export type SetUserUpdateStatusMutationVariables = Exact<{
  userId: Scalars["ID"];
  status: UserUpdateStatus;
}>;

export type SetUserUpdateStatusMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "setUserUpdateStatus"
>;

export type UserInfoFragment = { __typename?: "User" } & Pick<
  User,
  "id" | "username" | "updateStatus" | "removeStatus"
> & { friends: Array<{ __typename?: "User" } & Pick<User, "id" | "username">> };

export type UsersListQueryVariables = Exact<{ [key: string]: never }>;

export type UsersListQuery = { __typename?: "Query" } & {
  users: Array<{ __typename?: "User" } & UserInfoFragment>;
};

export const ErrorsFragmentDoc = gql`
  fragment Errors on Error {
    ... on ValidationError {
      field
      message
    }
    ... on ServerError {
      message
    }
  }
`;
export const UserInfoFragmentDoc = gql`
  fragment UserInfo on User {
    id
    username
    friends {
      id
      username
    }
    updateStatus @client
    removeStatus @client
  }
`;
export const ChangeUsernameDocument = gql`
  mutation ChangeUsername(
    $userId: ID!
    $changeUsernameInput: ChangeUsernameInput!
  ) {
    changeUsername(userId: $userId, changeUsernameInput: $changeUsernameInput) {
      record {
        ...UserInfo
      }
      errors {
        ...Errors
      }
    }
  }
  ${UserInfoFragmentDoc}
  ${ErrorsFragmentDoc}
`;
export type ChangeUsernameMutationFn = Apollo.MutationFunction<
  ChangeUsernameMutation,
  ChangeUsernameMutationVariables
>;

/**
 * __useChangeUsernameMutation__
 *
 * To run a mutation, you first call `useChangeUsernameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeUsernameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeUsernameMutation, { data, loading, error }] = useChangeUsernameMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      changeUsernameInput: // value for 'changeUsernameInput'
 *   },
 * });
 */
export function useChangeUsernameMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ChangeUsernameMutation,
    ChangeUsernameMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ChangeUsernameMutation,
    ChangeUsernameMutationVariables
  >(ChangeUsernameDocument, options);
}
export type ChangeUsernameMutationHookResult = ReturnType<
  typeof useChangeUsernameMutation
>;
export type ChangeUsernameMutationResult =
  Apollo.MutationResult<ChangeUsernameMutation>;
export type ChangeUsernameMutationOptions = Apollo.BaseMutationOptions<
  ChangeUsernameMutation,
  ChangeUsernameMutationVariables
>;
export const CreateUserDocument = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      record {
        ...UserInfo
      }
      errors {
        ...Errors
      }
    }
  }
  ${UserInfoFragmentDoc}
  ${ErrorsFragmentDoc}
`;
export type CreateUserMutationFn = Apollo.MutationFunction<
  CreateUserMutation,
  CreateUserMutationVariables
>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      createUserInput: // value for 'createUserInput'
 *   },
 * });
 */
export function useCreateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateUserMutation,
    CreateUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(
    CreateUserDocument,
    options
  );
}
export type CreateUserMutationHookResult = ReturnType<
  typeof useCreateUserMutation
>;
export type CreateUserMutationResult =
  Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<
  CreateUserMutation,
  CreateUserMutationVariables
>;
export const GetUserDocument = gql`
  query GetUser($userId: ID!) {
    user(userId: $userId) {
      ...UserInfo
    }
  }
  ${UserInfoFragmentDoc}
`;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserQuery(
  baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(
    GetUserDocument,
    options
  );
}
export function useGetUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(
    GetUserDocument,
    options
  );
}
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<
  GetUserQuery,
  GetUserQueryVariables
>;
export const RemoveUserDocument = gql`
  mutation RemoveUser($userId: ID!) {
    removeUser(userId: $userId) {
      record {
        ...UserInfo
      }
      errors {
        ...Errors
      }
    }
  }
  ${UserInfoFragmentDoc}
  ${ErrorsFragmentDoc}
`;
export type RemoveUserMutationFn = Apollo.MutationFunction<
  RemoveUserMutation,
  RemoveUserMutationVariables
>;

/**
 * __useRemoveUserMutation__
 *
 * To run a mutation, you first call `useRemoveUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUserMutation, { data, loading, error }] = useRemoveUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useRemoveUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveUserMutation,
    RemoveUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RemoveUserMutation, RemoveUserMutationVariables>(
    RemoveUserDocument,
    options
  );
}
export type RemoveUserMutationHookResult = ReturnType<
  typeof useRemoveUserMutation
>;
export type RemoveUserMutationResult =
  Apollo.MutationResult<RemoveUserMutation>;
export type RemoveUserMutationOptions = Apollo.BaseMutationOptions<
  RemoveUserMutation,
  RemoveUserMutationVariables
>;
export const ServerActionPerformedDocument = gql`
  subscription ServerActionPerformed {
    serverActionPerformed {
      date
      message
    }
  }
`;

/**
 * __useServerActionPerformedSubscription__
 *
 * To run a query within a React component, call `useServerActionPerformedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useServerActionPerformedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useServerActionPerformedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useServerActionPerformedSubscription(
  baseOptions?: Apollo.SubscriptionHookOptions<
    ServerActionPerformedSubscription,
    ServerActionPerformedSubscriptionVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<
    ServerActionPerformedSubscription,
    ServerActionPerformedSubscriptionVariables
  >(ServerActionPerformedDocument, options);
}
export type ServerActionPerformedSubscriptionHookResult = ReturnType<
  typeof useServerActionPerformedSubscription
>;
export type ServerActionPerformedSubscriptionResult =
  Apollo.SubscriptionResult<ServerActionPerformedSubscription>;
export const SetUserRemoveStatusDocument = gql`
  mutation setUserRemoveStatus($userId: ID!, $status: UserRemoveStatus!) {
    setUserRemoveStatus(userId: $userId, status: $status) @client
  }
`;
export type SetUserRemoveStatusMutationFn = Apollo.MutationFunction<
  SetUserRemoveStatusMutation,
  SetUserRemoveStatusMutationVariables
>;

/**
 * __useSetUserRemoveStatusMutation__
 *
 * To run a mutation, you first call `useSetUserRemoveStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetUserRemoveStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setUserRemoveStatusMutation, { data, loading, error }] = useSetUserRemoveStatusMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useSetUserRemoveStatusMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SetUserRemoveStatusMutation,
    SetUserRemoveStatusMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SetUserRemoveStatusMutation,
    SetUserRemoveStatusMutationVariables
  >(SetUserRemoveStatusDocument, options);
}
export type SetUserRemoveStatusMutationHookResult = ReturnType<
  typeof useSetUserRemoveStatusMutation
>;
export type SetUserRemoveStatusMutationResult =
  Apollo.MutationResult<SetUserRemoveStatusMutation>;
export type SetUserRemoveStatusMutationOptions = Apollo.BaseMutationOptions<
  SetUserRemoveStatusMutation,
  SetUserRemoveStatusMutationVariables
>;
export const SetUserUpdateStatusDocument = gql`
  mutation setUserUpdateStatus($userId: ID!, $status: UserUpdateStatus!) {
    setUserUpdateStatus(userId: $userId, status: $status) @client
  }
`;
export type SetUserUpdateStatusMutationFn = Apollo.MutationFunction<
  SetUserUpdateStatusMutation,
  SetUserUpdateStatusMutationVariables
>;

/**
 * __useSetUserUpdateStatusMutation__
 *
 * To run a mutation, you first call `useSetUserUpdateStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetUserUpdateStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setUserUpdateStatusMutation, { data, loading, error }] = useSetUserUpdateStatusMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useSetUserUpdateStatusMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SetUserUpdateStatusMutation,
    SetUserUpdateStatusMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SetUserUpdateStatusMutation,
    SetUserUpdateStatusMutationVariables
  >(SetUserUpdateStatusDocument, options);
}
export type SetUserUpdateStatusMutationHookResult = ReturnType<
  typeof useSetUserUpdateStatusMutation
>;
export type SetUserUpdateStatusMutationResult =
  Apollo.MutationResult<SetUserUpdateStatusMutation>;
export type SetUserUpdateStatusMutationOptions = Apollo.BaseMutationOptions<
  SetUserUpdateStatusMutation,
  SetUserUpdateStatusMutationVariables
>;
export const UsersListDocument = gql`
  query UsersList {
    users {
      ...UserInfo
    }
  }
  ${UserInfoFragmentDoc}
`;

/**
 * __useUsersListQuery__
 *
 * To run a query within a React component, call `useUsersListQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersListQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersListQuery(
  baseOptions?: Apollo.QueryHookOptions<UsersListQuery, UsersListQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UsersListQuery, UsersListQueryVariables>(
    UsersListDocument,
    options
  );
}
export function useUsersListLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UsersListQuery,
    UsersListQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UsersListQuery, UsersListQueryVariables>(
    UsersListDocument,
    options
  );
}
export type UsersListQueryHookResult = ReturnType<typeof useUsersListQuery>;
export type UsersListLazyQueryHookResult = ReturnType<
  typeof useUsersListLazyQuery
>;
export type UsersListQueryResult = Apollo.QueryResult<
  UsersListQuery,
  UsersListQueryVariables
>;

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    Error: ["ServerError", "ValidationError"],
  },
};
export default result;
