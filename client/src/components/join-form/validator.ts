import { z } from 'zod';

import { NAME_MAX_LENGTH } from '@/lib/constants';

const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(NAME_MAX_LENGTH, `Name must not exceed ${NAME_MAX_LENGTH} characters`);

export const joinRoomSchema = z.object({
  name: nameSchema,
  roomId: z.string().min(1, 'Room ID is required'),
});

export const createRoomSchema = z.object({
  name: nameSchema,
});

export type JoinRoomFormSchema = z.infer<typeof joinRoomSchema>;
export type CreateRoomFormSchema = z.infer<typeof createRoomSchema>;
