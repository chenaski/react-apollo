import React from "react";

import {
  ErrorMessageFragment,
  useRemoveUserMutation,
  UserInfoFragment as UserInfo,
  UserRemoveStatus,
  useSetUserRemoveStatusMutation,
} from "../generated/graphql";
import { GetUserQuery } from "../graphql/GetUserQuery";
import { UsersListQuery } from "../graphql/UsersListQuery";

import { Button } from "./Button/Button";

export interface RemoveUserButtonProps {
  userId: string;
  updatePolicy?: "refetch" | "cacheUpdate";
  cacheUpdateTarget?: "list" | "item" | "listAndItem" | "evict";
  onSuccess?: () => void;
  onError?: (error: ErrorMessageFragment) => void;
  className?: string;
  children: React.ReactNode;
}

export const RemoveUserButton = ({
  userId,
  updatePolicy,
  cacheUpdateTarget = "listAndItem",
  onSuccess,
  onError,
  className,
  children,
}: RemoveUserButtonProps) => {
  const [setUserRemoveStatus] = useSetUserRemoveStatusMutation();
  const [removeUser, { loading }] = useRemoveUserMutation({
    refetchQueries: updatePolicy === "refetch" ? ["UsersList"] : undefined,
    update: (cache, { data, errors }) => {
      if (updatePolicy === "cacheUpdate") {
        const usersListQueryResult: { users: UserInfo[] } | null =
          cache.readQuery({
            query: UsersListQuery,
          });
        const user = data?.removeUser?.record;

        if (!usersListQueryResult?.users || !user) return;

        if (["listAndItem", "item"].includes(cacheUpdateTarget)) {
          cache.writeQuery({
            query: GetUserQuery,
            variables: { userId: user.id },
            data: { user: null },
          });
        }

        if (["listAndItem", "list"].includes(cacheUpdateTarget)) {
          cache.writeQuery({
            query: UsersListQuery,
            data: {
              users: usersListQueryResult.users.filter(
                (user) => user.id !== userId
              ),
            },
          });
        }

        if (cacheUpdateTarget === "evict") {
          cache.evict({ id: cache.identify(user) });
        }
      }
    },
    onCompleted: async (data) => {
      await setUserRemoveStatus({
        variables: { userId, status: UserRemoveStatus.Success },
      });

      if (data.removeUser?.error) {
        onError && onError(data.removeUser?.error);
      } else {
        onSuccess && onSuccess();
      }
    },
    onError: async () => {
      await setUserRemoveStatus({
        variables: { userId, status: UserRemoveStatus.Failure },
      });
    },
  });

  const onClick = async () => {
    await setUserRemoveStatus({
      variables: { userId, status: UserRemoveStatus.Started },
    });
    await removeUser({
      variables: {
        userId,
      },
    });
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
