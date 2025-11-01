/**
 * UUID generation utility
 * Compatible with React Native (crypto.randomUUID not available)
 */

/**
 * Generate a unique ID string
 * Format: timestamp-random-random
 * Example: "1703123456789-abc123-xyz789"
 */
export function generateUUID(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${Math.random().toString(36).substring(2, 9)}`;
}

