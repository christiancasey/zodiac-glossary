import React from 'react';

const GetDataTests = () => {
  const [users, setUsers] = React.useState(null);
  const [languages, setLanguages] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/users/')
    .then(res => res.json())
    .then(data => setUsers(data));

    fetch('/api/languages/')
    .then(res => res.json())
    .then(data => setLanguages(data));
  }, []);

  return (
    <footer style={{marginTop: '10cm', float: 'left'}}>
      <hr /><hr /><hr />
      <h1 style={{color: 'red'}}>THIS IS A BUNCH OF DEV STUFF FOR TESTING DATA IO</h1>
      <h2 style={{color: 'red'}}>IGNORE EVERYTHING BELOW THIS LINE</h2>
      <h1>Zodiac Contributors</h1>
      <div>
        {!users ? "Loading users..." : 
          users.map(user => (
            <div key={user.user_id}>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <hr />
            </div>
          ))
        }
      </div>
      <div>
        <h1>Zodiac Languages</h1>
        {!languages ? "Loading languages..." : 
          languages.map(language => (
            <div key={language.language_id}>
              <p>Language: {language.language}</p>
              <p>Active: {language.active ? 'true' : 'false'}</p>
              <hr />
            </div>
          ))
        }
      </div>
    </footer>
  );
};

export default GetDataTests;