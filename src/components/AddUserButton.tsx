import React from "react";

import {
  ErrorsFragment,
  useCreateUserMutation,
  UserInfoFragment,
} from "../generated/graphql";
import { GetUserQuery } from "../graphql/GetUserQuery";
import { UsersListQuery } from "../graphql/UsersListQuery";

import { Button } from "./Button/Button";

export interface AddUserButtonProps {
  username: string;
  updatePolicy?: "refetch" | "cacheUpdate";
  cacheUpdateTarget?: "list" | "item" | "listAndItem";
  onSuccess?: () => void;
  onError?: (errors: ErrorsFragment[]) => void;
  className?: string;
  children: React.ReactNode;
}

export const AddUserButton = ({
  username,
  updatePolicy,
  cacheUpdateTarget = "listAndItem",
  onSuccess,
  onError,
  className,
  children,
}: AddUserButtonProps) => {
  const [createUser, { loading }] = useCreateUserMutation({
    refetchQueries: updatePolicy === "refetch" ? ["UsersList"] : undefined,
    update: (cache, { data, errors }) => {
      if (updatePolicy === "cacheUpdate") {
        const usersListQueryResult: { users: UserInfoFragment[] } | null =
          cache.readQuery({
            query: UsersListQuery,
          });
        const user = data?.createUser?.record;

        if (!usersListQueryResult?.users || !user) return;

        if (["listAndItem", "item"].includes(cacheUpdateTarget)) {
          cache.writeQuery({
            query: GetUserQuery,
            variables: { userId: user.id },
            data: { user },
          });
        }

        if (["listAndItem", "list"].includes(cacheUpdateTarget)) {
          cache.writeQuery({
            query: UsersListQuery,
            data: { users: [...usersListQueryResult.users, user] },
          });
        }
      }
    },
  });

  const onClick = async () => {
    const result = await createUser({
      variables: {
        createUserInput: {
          username,
        },
      },
    });

    if (result.data?.createUser?.errors) {
      onError && onError(result.data?.createUser?.errors);
    } else if (!result.errors) {
      onSuccess && onSuccess();
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
