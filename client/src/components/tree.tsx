/**
 * This component is a tree view that can be used to display a hierarchical list
 * of items. It supports expanding and collapsing items, selecting items, and
 * loading states.
 *
 * @component
 * @example
 * ```tsx
 * <Tree
 *   data={items}
 *   onSelectChange={(item) => handleSelect(item)}
 *   className="h-full"
 * />
 * ```
 *
 * @remarks
 * Modified by Dulapah Vibulsanti (https://github.com/dulapahv) from a comment
 * on an issue in shadcn-ui/ui by WangLarry (https://github.com/WangLarry).
 * Reference: https://github.com/shadcn-ui/ui/issues/355#issuecomment-1703767574
 *
 * Uses the following components:
 * - [`ScrollArea`](src/components/ui/scroll-area.tsx) for scrolling
 * - [`Accordion`](src/components/ui/accordion.tsx) for expanding/collapsing
 */

'use client';

import {
  ComponentPropsWithoutRef,
  ComponentRef,
  forwardRef,
  HTMLAttributes,
  useCallback,
  useState,
} from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronRight, FileCode, Folder, type LucideIcon } from 'lucide-react';
import useResizeObserver from 'use-resize-observer';

import { cn } from '@/lib/utils';
import { itemType } from '@/components/repo-browser/types/tree';
import { Spinner } from '@/components/spinner';
import { ScrollArea } from '@/components/ui/scroll-area';

// Base interface for tree items
interface TreeDataItem {
  id: string;
  name: string;
  icon?: LucideIcon;
  children?: TreeDataItem[];
  type?: string;
  isLoading?: boolean;
}

interface TreeProps extends HTMLAttributes<HTMLDivElement> {
  data: TreeDataItem[] | TreeDataItem;
  initialSelectedItemId?: string;
  onSelectChange?: (item: TreeDataItem) => void;
}

const Tree = forwardRef<HTMLDivElement, TreeProps>(
  (
    { data, initialSelectedItemId, onSelectChange, className, ...props },
    ref,
  ) => {
    const [selectedItemId, setSelectedItemId] = useState<string | undefined>(
      initialSelectedItemId,
    );
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    const handleSelectChange = useCallback(
      (item: TreeDataItem) => {
        setSelectedItemId(item.id);
        if (onSelectChange) {
          onSelectChange(item);
        }
      },
      [onSelectChange],
    );

    const handleExpand = useCallback((itemId: string) => {
      setExpandedIds((prev) => {
        if (prev.includes(itemId)) {
          return prev.filter((id) => id !== itemId);
        }
        return [...prev, itemId];
      });
    }, []);

    const { ref: refRoot, width, height } = useResizeObserver();

    return (
      <div ref={refRoot} className={cn('overflow-hidden', className)}>
        <ScrollArea style={{ width, height }}>
          <div className="relative p-2">
            <TreeItem
              data={data}
              ref={ref}
              selectedItemId={selectedItemId}
              handleSelectChange={handleSelectChange}
              expandedIds={expandedIds}
              onExpand={handleExpand}
              FolderIcon={Folder}
              ItemIcon={FileCode}
              {...props}
            />
          </div>
        </ScrollArea>
      </div>
    );
  },
);
Tree.displayName = 'Tree';

type TreeItemProps = TreeProps & {
  selectedItemId?: string;
  handleSelectChange: (item: TreeDataItem) => void;
  expandedIds: string[];
  onExpand: (itemId: string) => void;
  FolderIcon?: LucideIcon;
  ItemIcon?: LucideIcon;
};

const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      className,
      data,
      selectedItemId,
      handleSelectChange,
      expandedIds,
      onExpand,
      FolderIcon,
      ItemIcon,
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} role="tree" className={className} {...props}>
        <ul>
          {data instanceof Array ? (
            data.map((item) => (
              <li key={item.id}>
                {item.children ||
                item.type === itemType.REPO ||
                item.type === itemType.BRANCH ||
                item.type === itemType.DIR ? (
                  <AccordionPrimitive.Root
                    type="multiple"
                    defaultValue={expandedIds}
                    onValueChange={() => {
                      onExpand(item.id);
                    }}
                  >
                    <AccordionPrimitive.Item value={item.id}>
                      <AccordionTrigger
                        className={cn(
                          'px-2 before:absolute before:left-1 before:-z-10 before:h-[1.75rem] before:w-[calc(100%-8px)] before:rounded before:bg-secondary before:opacity-0 before:transition-opacity hover:before:opacity-50',
                          selectedItemId === item.id &&
                            'text-accent-foreground before:border-l-4 before:border-l-accent-foreground/50 before:bg-accent before:opacity-50',
                        )}
                        onClick={() => handleSelectChange(item)}
                      >
                        {item.icon && (
                          <item.icon
                            className="mr-2 size-4 shrink-0 text-accent-foreground/50"
                            aria-hidden="true"
                          />
                        )}
                        {!item.icon && FolderIcon && (
                          <FolderIcon
                            className="mr-2 size-4 shrink-0 text-accent-foreground/50"
                            aria-hidden="true"
                          />
                        )}
                        <span className="truncate text-sm">{item.name}</span>
                        {item.isLoading && (
                          <Spinner size="sm" className="ml-2" />
                        )}
                      </AccordionTrigger>
                      <AccordionContent className="ml-4 pl-2">
                        {item.children && (
                          <TreeItem
                            data={item.children}
                            selectedItemId={selectedItemId}
                            handleSelectChange={handleSelectChange}
                            expandedIds={expandedIds}
                            onExpand={onExpand}
                            FolderIcon={FolderIcon}
                            ItemIcon={ItemIcon}
                          />
                        )}
                      </AccordionContent>
                    </AccordionPrimitive.Item>
                  </AccordionPrimitive.Root>
                ) : (
                  <Leaf
                    item={item}
                    isSelected={selectedItemId === item.id}
                    onClick={() => handleSelectChange(item)}
                    Icon={ItemIcon}
                  />
                )}
              </li>
            ))
          ) : (
            <li>
              <Leaf
                item={data}
                isSelected={selectedItemId === data.id}
                onClick={() => handleSelectChange(data)}
                Icon={ItemIcon}
              />
            </li>
          )}
        </ul>
      </div>
    );
  },
);
TreeItem.displayName = 'TreeItem';

const Leaf = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    item: TreeDataItem;
    isSelected?: boolean;
    Icon?: LucideIcon;
  }
>(({ className, item, isSelected, Icon, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex cursor-pointer items-center px-2 py-2 before:absolute before:left-1 before:right-1 before:-z-10 before:h-[1.75rem] before:w-[calc(100%-8px)] before:rounded before:bg-secondary before:opacity-0 before:transition-opacity hover:before:opacity-50',
      className,
      isSelected &&
        'text-accent-foreground before:border-l-4 before:border-l-accent-foreground/50 before:bg-accent before:opacity-50',
    )}
    {...props}
  >
    {item.icon && (
      <item.icon
        className="mr-2 size-4 shrink-0 text-accent-foreground/50"
        aria-hidden="true"
      />
    )}
    {!item.icon && Icon && (
      <Icon
        className="mr-2 size-4 shrink-0 text-accent-foreground/50"
        aria-hidden="true"
      />
    )}
    <span className="flex-grow truncate text-sm">{item.name}</span>
  </div>
));
Leaf.displayName = 'Leaf';

const AccordionTrigger = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex w-full flex-1 items-center py-2 transition-all last:[&[data-state=open]>svg]:rotate-90',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto size-4 shrink-0 text-accent-foreground/50 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down left-3 overflow-hidden border-l border-foreground/10 text-sm transition-all',
      className,
    )}
    {...props}
  >
    <div className="pb-1 pt-0">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Tree, type TreeDataItem };
