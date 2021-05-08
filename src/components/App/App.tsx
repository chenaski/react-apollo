import React from "react";
import classes from "./App.module.css";

import { CreateUserForm } from "../CreateUserForm";
import { UsersList } from "../UsersList/UsersList";
import { ChangeUserForm } from "../ChangeUserForm/ChangeUserForm";

function App() {
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(
    null
  );
  const onSelectUser = ({ userId }: { userId: string }) => {
    if (selectedUserId === userId) setSelectedUserId(null);
    else setSelectedUserId(userId);
  };

  return (
    <div className={classes.App}>
      <div className={classes.AppRow}>
        <div>
          <CreateUserForm />
          {selectedUserId && <ChangeUserForm userId={selectedUserId} />}
        </div>

        <UsersList onSelectUser={onSelectUser} />
      </div>
    </div>
  );
}

export default App;
