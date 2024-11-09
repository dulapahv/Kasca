/**
 * This component is responsible for rendering a language selection dropdown
 * that allows users to select the programming language for the editor.
 *
 * Created by Dulapah Vibulsanti (https://github.com/dulapahv).
 */

import { useCallback, useMemo, useState } from 'react';
import { Monaco } from '@monaco-editor/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as monaco from 'monaco-editor';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Language {
  alias: string;
  extensions: string[];
  id: string;
}

interface LanguageSelectionProps {
  monaco: Monaco | null;
  editor: monaco.editor.IStandaloneCodeEditor | null;
  defaultLanguage?: string;
  className?: string;
}

export function LanguageSelection({
  monaco,
  editor,
  defaultLanguage = 'Python',
  className,
}: LanguageSelectionProps) {
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);

  // Memoize languages array to prevent unnecessary recalculations
  const languages = useMemo(() => {
    if (!monaco) return [];

    return monaco.languages.getLanguages().map(
      (language) =>
        ({
          alias: language.aliases?.[0] || 'Unknown',
          extensions: language.extensions || [],
          id: language.id,
        }) as Language,
    );
  }, [monaco]);

  const handleSelect = useCallback(
    (currentValue: string) => {
      const newLanguage = currentValue.split('$')[0];
      setSelectedLanguage(newLanguage);
      setOpen(false);

      const model = editor?.getModel();
      if (!model || !monaco) return;

      const selectedLang = languages.find((l) => l.alias === newLanguage);
      monaco.editor.setModelLanguage(model, selectedLang?.id || 'plaintext');
    },
    [editor, monaco, languages],
  );

  if (!monaco || !editor) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          aria-label="Select programming language"
          className={cn(
            'h-fit w-fit justify-between gap-x-1 rounded-sm p-0 pl-2 pr-1 text-xs',
            className,
          )}
        >
          {selectedLanguage}
          <ChevronsUpDown className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command>
          <CommandInput placeholder="Search language..." className="h-9" />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language.id}
                  value={`${language.alias}$${language.extensions.join(', ')}`}
                  onSelect={handleSelect}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{language.alias}</span>
                    {language.extensions.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {language.extensions.join(', ')}
                      </span>
                    )}
                  </div>
                  <Check
                    className={cn(
                      'ml-2 h-4 w-4 flex-shrink-0 transition-opacity',
                      selectedLanguage === language.alias
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}