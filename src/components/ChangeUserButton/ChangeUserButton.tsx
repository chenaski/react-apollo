import React from "react";

import { useApolloClient } from "@apollo/client";

import {
  ChangeUsernameInput,
  ChangeUsernameMutation,
  useChangeUsernameMutation,
  useGetUserQuery,
  UserUpdateStatus,
  useSetUserUpdateStatusMutation,
  UserInfoFragment as UserInfo,
} from "../../generated/graphql";
import { GetUserQuery } from "../../graphql/GetUserQuery";
import { UserInfoFragment } from "../../graphql/UserInfoFragment";
import { Button } from "../Button/Button";
import { CheckboxRow } from "../CheckboxRow/CheckboxRow";

import classes from "./ChangeUserButton.module.css";

export interface ChangeUserButtonProps {
  userId: string;
  username: string;
  cacheOnly?: "writeQuery" | "writeFragment";
  optimistic?: boolean;
  className?: string;
  onSuccess: (username?: string) => void;
  children: React.ReactNode;
}

export const ChangeUserButton = ({
  userId,
  username,
  cacheOnly,
  optimistic,
  onSuccess,
  className,
  children,
}: ChangeUserButtonProps) => {
  const apolloClient = useApolloClient();
  const [isOptimisticUpdateEnabled, setIsOptimisticUpdateEnabled] =
    React.useState(false);

  const { data } = useGetUserQuery({ variables: { userId } });
  const getOptimisticResponse = ():
    | (({
        userId,
        changeUsernameInput,
      }: {
        userId: string;
        changeUsernameInput: ChangeUsernameInput;
      }) => ChangeUsernameMutation)
    | undefined => {
    if (!isOptimisticUpdateEnabled || !data?.user) return;

    return (vars) => {
      return {
        changeUsername: {
          ...(data?.user as UserInfo),
          username: vars.changeUsernameInput.username,
        },
      };
    };
  };

  const [setUserUpdateStatus] = useSetUserUpdateStatusMutation();
  const [changeUsername, { loading }] = useChangeUsernameMutation({
    onCompleted: async (data) => {
      await setUserUpdateStatus({
        variables: { userId, status: UserUpdateStatus.Success },
      });

      onSuccess && onSuccess(data.changeUsername?.username);
    },
    onError: async () => {
      await setUserUpdateStatus({
        variables: { userId, status: UserUpdateStatus.Failure },
      });
    },
    optimisticResponse: getOptimisticResponse(),
  });

  const getUserCacheId = ({
    userId,
  }: {
    userId: string;
  }): string | undefined => {
    return apolloClient.cache.identify({
      __typename: "User",
      id: userId,
    });
  };

  const onClick = async () => {
    await setUserUpdateStatus({
      variables: { userId, status: UserUpdateStatus.Started },
    });

    if (!cacheOnly) {
      await changeUsername({
        variables: {
          userId,
          changeUsernameInput: {
            username,
          },
        },
      });
    } else if (cacheOnly === "writeQuery") {
      const result = apolloClient.readQuery({
        query: GetUserQuery,
        variables: { userId },
      });

      if (!result) return;

      const { user } = result;

      apolloClient.writeQuery({
        query: GetUserQuery,
        variables: { userId },
        data: { user: { ...user, username } },
      });

      await setUserUpdateStatus({
        variables: { userId, status: UserUpdateStatus.Success },
      });
    } else if (cacheOnly === "writeFragment") {
      const user = apolloClient.readFragment({
        fragment: UserInfoFragment,
        id: getUserCacheId({ userId }),
      });

      if (!user) return;

      apolloClient.writeFragment({
        fragment: UserInfoFragment,
        id: getUserCacheId({ userId }),
        data: { username },
      });

      await setUserUpdateStatus({
        variables: { userId, status: UserUpdateStatus.Success },
      });
    }
  };

  const button = (
    <Button
      onClick={onClick}
      disabled={loading}
      loading={loading}
      className={className}
    >
      {children}
    </Button>
  );

  if (optimistic) {
    return (
      <div className={classes.buttonContainer}>
        {button}

        {optimistic && (
          <CheckboxRow
            onChange={setIsOptimisticUpdateEnabled}
            checked={isOptimisticUpdateEnabled}
          >
            Optimistic Update
          </CheckboxRow>
        )}
      </div>
    );
  }

  return button;
};
