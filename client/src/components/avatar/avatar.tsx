import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { COLORS } from "@/lib/constants";
import { cn, hashString } from "@/lib/utils";

interface AvatarProps {
  readonly name: string;
}

export function Avatar({ name }: AvatarProps) {
  // If name has only 1 word, take the first 2 letters
  // If name has multiple words, take the first letter of the first 2 words
  const [first, second = ""] = name.split(" ");
  const initials = (first[0] + (second[0] || first[1] || "")).toUpperCase();

  const color = COLORS[hashString(name) % COLORS.length];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "flex h-8 w-8 cursor-default items-center justify-center rounded-full text-[#fff]",
          )}
          style={{ backgroundColor: color }}
        >
          {initials}
        </div>
      </TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  );
}