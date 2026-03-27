export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.searchParams.get('path') || 'database.json';

  const GITHUB_TOKEN = env.GITHUB_TOKEN;
  const REPO_OWNER = "ProfissionalJV";
  const REPO_NAME = "mcom_gesatao";

  const githubUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;

  try {
    const response = await fetch(githubUrl, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'Cloudflare-Pages'
      }
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
