/**
 * ShareButton component that displays a button to open a dialog for sharing room details.
 * Shows a tooltip on hover and handles opening the share dialog.
 *
 * @example
 * ```tsx
 * <ShareButton roomId="abc123" />
 * ```
 *
 * @param props - Component props
 * @param props.roomId - ID of the current room to share
 *
 * @remarks
 * Uses the following components:
 * - [`ShareDialog`](src/components/share-dialog/index.tsx) for sharing options
 * - [`Button`](src/components/ui/button.tsx) for trigger
 * - [`Dialog`](src/components/ui/dialog.tsx) for modal
 * - [`Tooltip`](src/components/ui/tooltip.tsx) for hover hints
 *
 * Created by Dulapah Vibulsanti (https://dulapahv.dev)
 */

import { useRef } from 'react';
import { Share } from 'lucide-react';

import { ShareDialog, ShareDialogRef } from '@/components/share-dialog';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RoomProps {
  roomId: string;
}

const ShareButton = ({ roomId }: RoomProps) => {
  const shareDialogRef = useRef<ShareDialogRef>(null);

  const handleButtonClick = () => {
    shareDialogRef.current?.openDialog();
  };

  return (
    <>
      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 animate-slide-in-top rounded-sm px-2 hover:!text-foreground"
              aria-label="Share room"
              onClick={handleButtonClick}
              style={{ color: 'var(--toolbar-foreground)' }}
            >
              <Share className="mr-2 size-4" />
              Share
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share Room</p>
          </TooltipContent>
        </Tooltip>
      </Dialog>
      <ShareDialog ref={shareDialogRef} roomId={roomId} />
    </>
  );
};

export { ShareButton };
