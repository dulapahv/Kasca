import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { GITHUB_API_URL } from '@/lib/constants';

export async function GET(
  req: NextRequest,
  { params }: { params: { params: string[] } },
) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return Response.json({ error: 'No access token found' }, { status: 401 });
    }

    const [action, owner, repo] = params.params;

    let endpoint = '';

    switch (action) {
      case 'branches':
        endpoint = `${GITHUB_API_URL}/repos/${owner}/${repo}/branches`;
        break;
      case 'contents':
        const { searchParams } = new URL(req.url);
        const path = searchParams.get('path') || '';
        const ref = searchParams.get('ref') || 'main';
        endpoint = `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}?ref=${ref}`;
        break;
      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('GitHub API Error:', error);
      return Response.json(
        { error: `GitHub API error: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}