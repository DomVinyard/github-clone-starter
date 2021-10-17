import axios from 'axios';
import { Octokit, App } from 'octokit';
import { createOAuthAppAuth } from '@octokit/auth-oauth-app';

//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
export async function handler(event, context) {
  try {
    const { token } = event.queryStringParameters || {};
    // const octokit = new Octokit({ auth: `personal-access-token123` });
    // const { data } = await octokit.rest.users.getAuthenticated();
    // console.log({ data });
    const { data } = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: '6683cfa14ce8e331caf7',
        client_secret: '2fb87b738dee92f802a080cd64b4a3e471e8e7e3',
        code: token,
        redirect_uri: 'http://localhost:8888/auth',
        headers: {
          accept: 'application/json',
        },
      }
    );
    const { access_token } = data.split('&').reduce((acc, curr) => {
      const [key, value] = curr.split('=');
      acc[key] = value;
      return acc;
    }, {});
    console.log({ access_token });
    const octokit = new Octokit({ auth: access_token });
    const {
      data: { login },
    } = await octokit.rest.users.getAuthenticated();

    const templateOwner = 'DomVinyard';
    const templateRepo = 'academy-blog-template';
    const newOwner = login;
    const newRepoName = `blog-project-${login}`;

    // console.log(octokit);

    await octokit.rest.repos.createUsingTemplate({
      template_owner: templateOwner,
      template_repo: templateRepo,
      owner: newOwner,
      name: newRepoName,
      private: false,
    });
    console.info(`Repository "${newRepoName}" created`);

    const repoURL = `https://github.com/${newOwner}/${newRepoName}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ repoURL }),
    };
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
}
