import React from "react";

import { useApolloClient } from "@apollo/client";

import {
  useChangeUsernameMutation,
  UserUpdateStatus,
  useSetUserUpdateStatusMutation,
} from "../generated/graphql";
import { GetUserQuery } from "../graphql/GetUserQuery";
import { UserInfoFragment } from "../graphql/UserInfoFragment";

import { Button } from "./Button/Button";

export interface ChangeUserButtonProps {
  userId: string;
  username: string;
  cacheOnly?: "writeQuery" | "writeFragment";
  className?: string;
  onSuccess: (username?: string) => void;
  children: React.ReactNode;
}

export const ChangeUserButton = ({
  userId,
  username,
  cacheOnly,
  onSuccess,
  className,
  children,
}: ChangeUserButtonProps) => {
  const apolloClient = useApolloClient();
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

  return (
    <Button
      onClick={onClick}
      disabled={loading}
      loading={loading}
      className={className}
    >
      {children}
    </Button>
  );
};
