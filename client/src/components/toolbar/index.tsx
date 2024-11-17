/**
 * This file contains the toolbar component for the code editor. It includes
 * the toolbar items and actions for the editor.
 *
 * Created by Dulapah Vibulsanti (https://dulapahv.dev).
 */

import { useEffect, useRef, useState } from 'react';
import { Monaco } from '@monaco-editor/react';
import type * as monaco from 'monaco-editor';

import { REPO_URL } from '@/lib/constants';
import { useMediaQuery } from '@/hooks/use-media-query';
import { AboutDialog, type AboutDialogRef } from '@/components/about-dialog';
import { LeaveDialog, type LeaveDialogRef } from '@/components/leave-dialog';
import {
  OpenFromGithubDialog,
  type OpenFromGithubDialogRef,
} from '@/components/open-from-github-dialog';
import {
  OpenPromptDialog,
  type OpenPromptDialogRef,
} from '@/components/open-prompt-dialog';
import {
  SaveToGithubDialog,
  type SaveToGithubDialogRef,
} from '@/components/save-to-github-dialog';
import {
  SettingsSheet,
  type SettingsSheetRef,
} from '@/components/settings-sheet';

import { DesktopMenu } from './components/desktop-menu';
import { MobileMenu } from './components/mobile-menu';
import type { ToolbarActions } from './types';
import { getOS, openLocal, saveLocal } from './utils';

interface ToolbarProps {
  monaco: Monaco | null;
  editor: monaco.editor.IStandaloneCodeEditor | null;
  roomId: string;
}

const Toolbar = ({ monaco, editor, roomId }: ToolbarProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [miniMap, setMiniMap] = useState(false);
  const [wordWrap, setWordWrap] = useState(false);

  const openFromGithubDialogRef = useRef<OpenFromGithubDialogRef>(null);
  const openPromptDialogRef1 = useRef<OpenPromptDialogRef>(null);
  const openPromptDialogRef2 = useRef<OpenPromptDialogRef>(null);
  const saveToGithubDialogRef = useRef<SaveToGithubDialogRef>(null);
  const settingsSheetRef = useRef<SettingsSheetRef>(null);
  const leaveDialogRef = useRef<LeaveDialogRef>(null);
  const aboutDialogRef = useRef<AboutDialogRef>(null);

  const modKey = getOS() === 'Mac' ? '⌘' : 'Ctrl';

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey) {
        if (event.shiftKey) {
          switch (event.key) {
            case 'O':
              event.preventDefault();
              openPromptDialogRef2.current?.openDialog();
              break;
            case 'S':
              event.preventDefault();
              saveToGithubDialogRef.current?.openDialog();
              break;
          }
        } else {
          switch (event.key) {
            case 'q':
              event.preventDefault();
              leaveDialogRef.current?.openDialog();
              break;
            case 's':
              event.preventDefault();
              if (monaco) saveLocal(monaco, editor);
              break;
            case ',':
              event.preventDefault();
              settingsSheetRef.current?.openDialog();
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [monaco, editor]);

  useEffect(() => {
    if (editor && monaco) {
      setMiniMap(editor.getOption(monaco.editor.EditorOption.minimap).enabled);
      setWordWrap(
        editor.getOption(monaco.editor.EditorOption.wordWrap) === 'on',
      );
    }
  }, [editor, monaco]);

  if (!monaco || !editor) return null;

  const toolbarActions: ToolbarActions = {
    openLocal: () => {
      if (!editor.getModel()?.getValue()) openLocal(monaco, editor);
      else openPromptDialogRef1.current?.openDialog();
    },
    openGitHub: () => {
      if (!editor.getModel()?.getValue())
        openFromGithubDialogRef.current?.openDialog();
      else openPromptDialogRef2.current?.openDialog();
    },
    saveLocal: () => saveLocal(monaco, editor),
    saveGitHub: () => saveToGithubDialogRef.current?.openDialog(),
    leaveRoom: () => leaveDialogRef.current?.openDialog(),
    settings: () => settingsSheetRef.current?.openDialog(),
    undo: () => {
      editor.focus();
      editor.trigger('keyboard', 'undo', null);
    },
    redo: () => {
      editor.focus();
      editor.trigger('keyboard', 'redo', null);
    },
    cut: () => {
      editor.focus();
      editor.trigger('keyboard', 'editor.action.clipboardCutAction', null);
    },
    copy: () => {
      editor.focus();
      editor.trigger('keyboard', 'editor.action.clipboardCopyAction', null);
    },
    paste: () => {
      editor.focus();
      editor.trigger('keyboard', 'editor.action.clipboardPasteAction', null);
    },
    find: () => editor.trigger('keyboard', 'actions.find', null),
    replace: () => {
      editor.focus();
      editor.trigger('keyboard', 'editor.action.startFindReplaceAction', null);
    },
    selectAll: () => {
      editor.focus();
      editor.trigger('keyboard', 'editor.action.selectAll', null);
    },
    copyLineUp: () => {
      editor.focus();
      editor.trigger('keyboard', 'editor.action.copyLinesUpAction', null);
    },
    copyLineDown: () => {
      editor.focus();
      editor.trigger('keyboard', 'editor.action.copyLinesDownAction', null);
    },
    moveLineUp: () => {
      editor.focus();
      editor.trigger('keyboard', 'editor.action.moveLinesUpAction', null);
    },
    moveLineDown: () => {
      editor.focus();
      editor.trigger('keyboard', 'editor.action.moveLinesDownAction', null);
    },
    duplicateSelection: () => {
      editor.focus();
      editor.trigger('keyboard', 'editor.action.duplicateSelection', null);
    },
    addCursorAbove: () => {
      editor.focus();
      editor.trigger('keyboard', 'editor.action.insertCursorAbove', null);
    },
    addCursorBelow: () => {
      editor.focus();
      editor.trigger('keyboard', 'editor.action.insertCursorBelow', null);
    },
    commandPalette: () => {
      // Timeout to prevent command palette triggering before editor is focussed
      editor.focus();
      setTimeout(() => {
        editor.trigger('keyboard', 'editor.action.quickCommand', null);
      }, 1);
    },
    minimap: () => {
      editor.updateOptions({ minimap: { enabled: !miniMap } });
      setMiniMap(!miniMap);
    },
    wordWrap: () => {
      editor.updateOptions({ wordWrap: wordWrap ? 'off' : 'on' });
      setWordWrap(!wordWrap);
    },
    manual: () => {
      window.open(`${REPO_URL}/blob/main/manual.md`, '_blank');
    },
    about: () => aboutDialogRef.current?.openDialog(),
  };

  return (
    <>
      {isDesktop ? (
        <DesktopMenu
          modKey={modKey}
          actions={toolbarActions}
          miniMap={miniMap}
          wordWrap={wordWrap}
        />
      ) : (
        <MobileMenu
          actions={toolbarActions}
          miniMap={miniMap}
          wordWrap={wordWrap}
        />
      )}
      <OpenFromGithubDialog
        ref={openFromGithubDialogRef}
        monaco={monaco}
        editor={editor}
      />
      <OpenPromptDialog
        ref={openPromptDialogRef1}
        callback={() => openLocal(monaco, editor)}
      />
      <OpenPromptDialog
        ref={openPromptDialogRef2}
        callback={() => openFromGithubDialogRef.current?.openDialog()}
      />
      <SaveToGithubDialog ref={saveToGithubDialogRef} editor={editor} />
      <SettingsSheet ref={settingsSheetRef} monaco={monaco} editor={editor} />
      <LeaveDialog ref={leaveDialogRef} roomId={roomId} />
      <AboutDialog ref={aboutDialogRef} />
    </>
  );
};

export { Toolbar };
