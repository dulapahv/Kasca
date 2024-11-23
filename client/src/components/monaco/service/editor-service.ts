/**
 * Service for handling Monaco editor lifecycle and configuration.
 * Manages editor setup, mounting, and event handling.
 *
 * @example
 * ```ts
 * // Initialize editor
 * handleBeforeMount(monaco);
 * handleOnMount(editor, monaco, disposablesRef, setCursorPosition);
 * ```
 *
 * @remarks
 * Uses the following services:
 * - [`getSocket`](src/lib/socket.ts) for editor synchronization
 * - Monaco editor API for editor configuration
 * - Theme definitions from monaco-themes package
 *
 * Created by Dulapah Vibulsanti (https://dulapahv.dev)
 */

import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import type { Monaco } from '@monaco-editor/react';
import type * as monaco from 'monaco-editor';
import themeList from 'monaco-themes/themes/themelist.json';

import { CodeServiceMsg } from '@common/types/message';
import { Cursor, EditOp } from '@common/types/operation';

import { getSocket } from '@/lib/socket';
import type { StatusBarCursorPosition } from '@/components/status-bar';

/**
 * Handle the Monaco editor before mounting.
 * @param monaco Monaco instance.
 */
export const handleBeforeMount = (monaco: Monaco): void => {
  Object.entries(themeList).forEach(([key, value]) => {
    const themeData = require(`monaco-themes/themes/${value}.json`);
    monaco.editor.defineTheme(key, themeData);
  });
};

/**
 * Handle the Monaco editor after mounting.
 * @param editor Monaco editor instance
 * @param monaco Monaco instance
 * @param editorRef Editor reference function
 * @param monacoRef Monaco reference function
 * @param editorInstanceRef Editor instance reference
 */
export const handleOnMount = (
  editor: monaco.editor.IStandaloneCodeEditor,
  monaco: Monaco,
  disposablesRef: MutableRefObject<monaco.IDisposable[]>,
  setCursorPosition: Dispatch<SetStateAction<StatusBarCursorPosition>>,
  defaultCode?: string,
): void => {
  const socket = getSocket();

  if (defaultCode) {
    editor.setValue(defaultCode);
  }
  editor.focus();

  editor.updateOptions({
    cursorSmoothCaretAnimation: 'on',
  });

  editor.getModel()?.setEOL(monaco.editor.EndOfLineSequence.LF);

  // Disable unwanted validations
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    diagnosticCodesToIgnore: [
      // 2304, // Ignore "Cannot find name" error
      // 2339, // Ignore "Property does not exist" error
      2792, // Ignore "Cannot find module" error
    ],
  });

  const cursorSelectionDisposable = editor.onDidChangeCursorSelection((ev) => {
    setCursorPosition({
      line: ev.selection.positionLineNumber,
      column: ev.selection.positionColumn,
      selected: editor.getModel()?.getValueLengthInRange(ev.selection) || 0,
    });

    // If the selection is empty, send only the cursor position
    if (
      ev.selection.startLineNumber === ev.selection.endLineNumber &&
      ev.selection.startColumn === ev.selection.endColumn
    ) {
      socket.emit(CodeServiceMsg.UPDATE_CURSOR, [
        ev.selection.positionLineNumber,
        ev.selection.positionColumn,
      ] as Cursor);
    } else {
      socket.emit(CodeServiceMsg.UPDATE_CURSOR, [
        ev.selection.positionLineNumber,
        ev.selection.positionColumn,
        ev.selection.startLineNumber,
        ev.selection.startColumn,
        ev.selection.endLineNumber,
        ev.selection.endColumn,
      ] as Cursor);
    }
  });

  disposablesRef.current.push(cursorSelectionDisposable);
};

/**
 * Handle changes in the editor.
 * @param value Current value in the editor.
 * @param ev Editor change event.
 * @param skipUpdateRef Skip update reference.
 */
export const handleOnChange = (
  value: string | undefined,
  ev: monaco.editor.IModelContentChangedEvent,
  skipUpdateRef: MutableRefObject<boolean>,
): void => {
  if (skipUpdateRef.current) return;
  const socket = getSocket();

  ev.changes.forEach((change) => {
    socket.emit(CodeServiceMsg.UPDATE_CODE, [
      change.text,
      change.range.startLineNumber,
      change.range.startColumn,
      change.range.endLineNumber,
      change.range.endColumn,
    ] as EditOp);
  });
};
