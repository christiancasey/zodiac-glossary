import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [users, setUsers] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/users/')
    .then(res => res.json())
    .then(data => setUsers(data));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          {!users ? "Loading..." : 
            users.map(user => (
              <div key={user.id}>
                <h1>Zodiac Contributors</h1>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
              </div>
            ))
          }
        </div>
      </header>
    </div>
  );
}

export default App;
