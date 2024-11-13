/**
 * API route handler for GitHub commit operations.
 * Handles creating and updating files in GitHub repositories.
 * Uses Edge Runtime for optimal performance.
 *
 * @example
 * ```ts
 * // Create/Update file in GitHub repo
 * POST /api/github/commit
 * {
 *   repo: "owner/repo",
 *   branch: "main",
 *   path: "src/",
 *   filename: "example.ts",
 *   commitMessage: "feat: add example file",
 *   content: "base64_encoded_content"
 * }
 * ```
 *
 * @interface CommitRequest
 * @property {string} repo - Repository in format 'owner/repo'
 * @property {string} branch - Target branch name
 * @property {string} path - File path in repository
 * @property {string} filename - Name of file to create/update
 * @property {string} commitMessage - Git commit message
 * @property {string} content - Base64 encoded file content
 *
 * @returns {Promise<Response>}
 * - Success: JSON response with commit details
 * - Error: JSON response with error message
 *
 * Created by Dulapah Vibulsanti (https://dulapahv.dev)
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { GITHUB_API_URL } from '@/lib/constants';

export const runtime = 'edge';

interface CommitRequest {
  repo: string;
  branch: string;
  path: string;
  filename: string;
  commitMessage: string;
  content: string; // Base64 encoded content
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    const body: CommitRequest = await request.json();
    const { repo, branch, path, filename, commitMessage, content } = body;

    // Construct the file path
    const filePath = path ? `${path}/${filename}` : filename;

    // Get the current file (if it exists) to get its SHA
    const getCurrentFile = async () => {
      try {
        const response = await fetch(
          `${GITHUB_API_URL}/repos/${repo}/contents/${filePath}?ref=${branch}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'X-GitHub-Api-Version': '2022-11-28',
            },
          },
        );

        if (response.status === 404) {
          return null;
        }

        const data = await response.json();
        return data.sha;
      } catch (error) {
        console.error('Error fetching current file:', error);
        return null;
      }
    };

    // Get the current file's SHA if it exists
    const currentSha = await getCurrentFile();

    // Prepare the request body
    const commitBody = {
      message: commitMessage,
      content,
      branch,
      ...(currentSha && { sha: currentSha }),
    };

    // Create or update the file
    const response = await fetch(
      `${GITHUB_API_URL}/repos/${repo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify(commitBody),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: 'Failed to commit file', details: error },
        { status: response.status },
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in commit route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}