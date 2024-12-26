import { CircleHelp } from 'lucide-react';

import { PRE_INSTALLED_LIBS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const HelpPopover = () => (
  <Popover>
    <Tooltip>
      <PopoverTrigger asChild>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            className="size-7 rounded-full border-[color:var(--sp-colors-surface3)] bg-[color:var(--sp-colors-surface2)] p-0 text-[color:var(--sp-colors-clickable)] hover:bg-[color:var(--sp-colors-surface3)] hover:text-[color:var(--sp-colors-hover)]"
          >
            <CircleHelp className="size-4" />
            <span className="sr-only">Help with code preview</span>
          </Button>
        </TooltipTrigger>
      </PopoverTrigger>
      <TooltipContent>
        <p>Help with code preview</p>
      </TooltipContent>
    </Tooltip>
    <PopoverContent className="mr-1 w-96 overflow-auto [@media(max-height:800px)]:max-h-96">
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Code Preview</h4>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h5 className="mb-2 font-medium">Usage Instructions</h5>
              <ul className="list-inside list-disc space-y-1">
                <li>Only HTML code is supported</li>
                <li>Tailwind CSS utility classes are available</li>
                <li>
                  Add custom styles with{' '}
                  <code className="rounded bg-muted px-1 text-xs">
                    &lt;style&gt;
                  </code>{' '}
                  tags
                </li>
                <li>
                  Add custom scripts with{' '}
                  <code className="rounded bg-muted px-1 text-xs">
                    &lt;script&gt;
                  </code>{' '}
                  tags
                </li>
                <li>
                  Add external libraries in{' '}
                  <code className="rounded bg-muted px-1 text-xs">
                    &lt;head&gt;
                  </code>{' '}
                  tags
                </li>
                <li>
                  <a
                    href="https://github.com/dulapahv/kasca/manual#code-preview-example"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-foreground underline underline-offset-2 !transition-all hover:text-muted-foreground"
                  >
                    See code preview examples
                    <span className="sr-only">(opens in new tab)</span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="mb-2 font-medium">Pre-installed Libraries</h5>
              <div className="overflow-y-auto rounded border border-border p-2">
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  {PRE_INSTALLED_LIBS.map((lib) => (
                    <li
                      key={lib.name}
                      className="flex items-center justify-between"
                    >
                      <span>{lib.name}</span>
                      <span className="text-xs text-muted-foreground">
                        v{lib.version}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="text-xs text-muted-foreground">
          <p>
            Powered by{' '}
            <a
              href="https://sandpack.codesandbox.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-2 !transition-all hover:text-muted-foreground"
            >
              Sandpack
            </a>
          </p>
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

export { HelpPopover };