import React from "react";
import "./App.css";
import { useUsersListQuery } from "./generated/graphql";
import { CreateUserForm } from "./CreateUserForm";

function App() {
  const { data, loading, error } = useUsersListQuery();

  return (
    <div className="App">
      <CreateUserForm />

      <section>
        <h1>Users</h1>

        {loading ? (
          <p>Loading...</p>
        ) : data?.users.length ? (
          <ul>
            {data.users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        ) : (
          <p>There is no data available</p>
        )}

        {!!error && <p>{error}</p>}
      </section>
    </div>
  );
}

export default App;
