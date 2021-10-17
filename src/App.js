import React, { useState } from 'react';
import './App.css';
import GitHubLogin from 'react-github-login';

const App = () => {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const onSuccess = (response) => {
    const { code } = response;
    setAuth(code);
  };
  const onFailure = (response) => console.error({ response });

  const doCreate = async (e) => {
    setLoading(true);
    const response = await fetch(`/.netlify/functions/create?token=${auth}`);
    const json = await response.json();
    console.log({ json });
    window.location.href = json.repoURL;
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Agile Blog Project</p>
        <p>
          {!auth ? (
            <GitHubLogin
              clientId="6683cfa14ce8e331caf7"
              redirectUri=""
              onSuccess={onSuccess}
              onFailure={onFailure}
              scope="user:email,repo"
            />
          ) : (
            <button onClick={doCreate}>
              {loading ? 'Generating your repository...' : 'Create Project'}
            </button>
          )}
          <br />
          <span>{msg}</span>
        </p>
      </header>
    </div>
  );
};

export default App;
