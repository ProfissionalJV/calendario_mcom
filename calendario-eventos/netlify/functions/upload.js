const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Agora recebemos o SHA também!
  const { fileName, content, message, sha } = JSON.parse(event.body);
  
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN; 
  const REPO_OWNER = "ProfissionalJV";
  const REPO_NAME = "mcom_gesatao"; 

  // Lógica: se for o database, fica na raiz. Se tiver outro nome, vai pra pasta uploads.
  const path = fileName === 'database.json' ? fileName : `uploads/${fileName}`;
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;

  try {
    const bodyPayload = {
      message: message,
      content: content
    };

    // SE vier um SHA (edição/exclusão), anexamos ao pedido
    if (sha) {
      bodyPayload.sha = sha;
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyPayload)
    });

    const data = await response.json();
    
    return {
      statusCode: response.status, // Retorna o status real do GitHub
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};