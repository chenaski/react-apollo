import React from "react";

import { AddUser } from "../AddUser/AddUser";
import { ChangeUser } from "../ChangeUser/ChangeUser";
import { Notifications } from "../Notifications/Notifications";
import { RemoveUser } from "../RemoveUser/RemoveUser";
import { UsersListContainer } from "../UsersListContainer/UsersListContainer";

import classes from "./App.module.css";

function App() {
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(
    null
  );
  const onSelectUser = ({ userId }: { userId: string }) => {
    if (selectedUserId === userId) setSelectedUserId(null);
    else setSelectedUserId(userId);
  };
  const onRemoveUser = () => {
    setSelectedUserId(null);
  };

  return (
    <div className={classes.container}>
      <h1>React-Apollo Playground</h1>

      <div className={classes.columns}>
        <div className={classes.actions}>
          <AddUser />
          {selectedUserId && <ChangeUser userId={selectedUserId} />}
          {selectedUserId && (
            <RemoveUser userId={selectedUserId} onRemoveUser={onRemoveUser} />
          )}
        </div>

        <div className={classes.rightColumn}>
          <UsersListContainer onSelectUser={onSelectUser} />
        </div>
      </div>

      <Notifications />
    </div>
  );
}

export default App;
