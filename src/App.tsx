import React from "react";
import "./App.css";
import { CreateUserForm } from "./components/CreateUserForm";
import { UsersList } from "./components/UsersList/UsersList";

function App() {
  return (
    <div className="App">
      <CreateUserForm />
      <UsersList />
    </div>
  );
}

export default App;
