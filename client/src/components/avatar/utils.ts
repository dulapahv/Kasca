/**
 * Utility functions for handling user display and formatting
 * Contains helper functions for name formatting and display.
 *
 * @example
 * ```ts
 * // Get initials from name
 * const initials = getInitials("John Doe"); // "JD"
 *
 * // Get display name
 * const displayName = getDisplayName(user, currentUserId); // "John Doe (you)"
 * ```
 *
 * @see [`User`](@common/types/user.ts) - User type definition
 *
 * Created by Dulapah Vibulsanti (https://dulapahv.dev)
 */

import type { User } from '@common/types/user';

/**
 * Generates initials from a name
 * @param name - Full name to generate initials from
 * @returns Two-letter initials in uppercase
 *
 * @example
 * ```ts
 * getInitials("John Doe") // "JD"
 * getInitials("Alice") // "AL"
 * getInitials("") // ""
 * ```
 */
export const getInitials = (name: string): string => {
  const [firstName, secondName = ''] = name.trim().split(/\s+/);
  const firstInitial = firstName?.[0] ?? '';
  const secondInitial = secondName?.[0] ?? firstName?.[1] ?? '';
  return (firstInitial + secondInitial).toUpperCase();
};

/**
 * Gets display name with "you" suffix for current user
 * @param user - User object containing ID and username
 * @param currentUserId - Current user's ID to check against
 * @returns Username with "(you)" suffix if IDs match
 *
 * @example
 * ```ts
 * getDisplayName({id: "123", username: "John"}, "123") // "John (you)"
 * getDisplayName({id: "456", username: "Alice"}, "123") // "Alice"
 * ```
 */
export const getDisplayName = (user: User, currentUserId: string) => {
  return user.id === currentUserId ? `${user.username} (you)` : user.username;
};