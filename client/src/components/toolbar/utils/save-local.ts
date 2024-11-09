/**
 * This utility function saves the current editor content to a local file.
 *
 * Created by Dulapah Vibulsanti (https://github.com/dulapahv).
 */

import * as monaco from 'monaco-editor';

interface Language {
  alias: string;
  extensions: readonly string[];
  id: string;
}

/**
 * Cache for Monaco languages to avoid repeated API calls
 */
let languagesCache: Language[] | null = null;

/**
 * Gets the file extension for a given language ID
 * @param languageId - The Monaco language identifier
 * @returns The preferred file extension including the dot, or '.txt' if none found
 */
function getFileExtension(languageId: string): string {
  if (!languagesCache) {
    languagesCache = monaco.languages.getLanguages().map(
      (language): Language => ({
        alias: language.aliases?.[0] ?? 'Unknown',
        extensions: language.extensions ?? [],
        id: language.id,
      }),
    );
  }

  const language = languagesCache.find((lang) => lang.id === languageId);
  return language?.extensions[0]
    ? `.${language.extensions[0].replace(/^\./, '')}`
    : '.txt';
}

/**
 * Saves the current editor content to a local file
 * @param editor - Monaco editor instance
 * @param filename - Optional custom filename without extension
 * @throws Error if editor is null or getValue() fails
 */
export function saveLocal(
  editor: monaco.editor.IStandaloneCodeEditor | null,
  filename = `kasca-${new Date().toLocaleString('en-GB').replace(/[/:, ]/g, '-')}`,
): void {
  if (!editor) {
    throw new Error('Editor instance is required');
  }

  try {
    const code = editor.getValue();
    const model = editor.getModel();

    if (!model) {
      throw new Error('Editor model not found');
    }

    const extension = getFileExtension(model.getLanguageId());
    const fullFilename = `${filename}${extension}`;

    // Create blob and download
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fullFilename;

    // Append to body, click, and cleanup
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(
      `Failed to save file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}