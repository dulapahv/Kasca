/**
 * Service for handling code updates in the Monaco editor.
 *
 * @example
 * ```typescript
 * updateCode(
 *   editOperation,
 *   editorRef,
 *   skipUpdateRef
 * );
 * ```
 *
 * Created by Dulapah Vibulsanti (https://dulapahv.dev)
 */

import { MutableRefObject } from 'react';
import type * as monaco from 'monaco-editor';

import type { EditOp } from '@common/types/operation';

/**
 * Update the code in the editor.
 * @param op - Edit operation containing range and text
 * @param editorInstanceRef - Reference to Monaco editor instance
 * @param skipUpdateRef - Reference to skip update flag
 *
 * @example
 * ```typescript
 * updateCode(
 *   editOperation,
 *   editorRef,
 *   skipUpdateRef
 * );
 * ```
 *
 * @remarks
 * Uses [`EditOp`](@common/types/operation.ts) type for operation data
 */
export const updateCode = (
  op: EditOp,
  editorInstanceRef: MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>,
  skipUpdateRef: MutableRefObject<boolean>,
): void => {
  const editor = editorInstanceRef.current;
  if (!editor) return;

  skipUpdateRef.current = true;
  const model = editor.getModel();
  if (model) {
    model.pushEditOperations(
      [],
      [
        {
          forceMoveMarkers: true,
          text: op[0],
          range: {
            startLineNumber: op[1],
            startColumn: op[2],
            endLineNumber: op[3],
            endColumn: op[4],
          },
        },
      ],
      () => [],
    );
  }
  skipUpdateRef.current = false;
};
