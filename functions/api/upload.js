export async function onRequestPost(context) {
  const { request, env } = context;
  const GITHUB_TOKEN = env.GITHUB_TOKEN;
  const REPO_OWNER = "ProfissionalJV";
  const REPO_NAME = "mcom_gesatao";

  try {
    const { fileName, content, message, sha } = await request.json();

    // Define o caminho: se for database.json fica na raiz, senão vai pra pasta uploads/
    const path = fileName === 'database.json' ? fileName : `uploads/${fileName}`;
    const githubUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;

    const bodyPayload = {
      message: message || 'Upload via Cloudflare Pages',
      content: content,
    };
    if (sha) bodyPayload.sha = sha;

    const githubResponse = await fetch(githubUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Cloudflare-Pages'
      },
      body: JSON.stringify(bodyPayload)
    });

    const data = await githubResponse.json();
    return new Response(JSON.stringify(data), {
      status: githubResponse.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
