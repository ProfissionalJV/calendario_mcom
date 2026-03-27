const fetch = require('node-fetch');

exports.handler = async (event) => {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = "ProfissionalJV";
  const REPO_NAME = "mcom_gesatao"; // Nome corrigido sem o "A"
  const path = event.queryStringParameters.path || 'database.json';

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};