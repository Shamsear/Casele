/**
 * Image Service Abstraction Layer
 * 
 * This module provides a unified interface for image storage providers.
 * To switch providers, just change the provider in the config below.
 * 
 * Current provider: ImageKit
 * Planned provider: Cloudflare R2
 */

import { imagekitProvider, type ImageProvider } from "./image-providers/imagekit";
// import { r2Provider } from "./image-providers/r2";

// ─── Configuration ────────────────────────────────────────────
// Change this to switch providers
const ACTIVE_PROVIDER = "imagekit";

const providers: Record<string, ImageProvider> = {
  imagekit: imagekitProvider,
  // r2: r2Provider, // Uncomment when ready
};

// ─── Public API ───────────────────────────────────────────────
const activeProvider = providers[ACTIVE_PROVIDER];

if (!activeProvider) {
  throw new Error(`Unknown image provider: ${ACTIVE_PROVIDER}`);
}

/**
 * Upload an image to the active provider
 * @param file - The file to upload
 * @param folder - Optional folder path (e.g., "products", "categories")
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  folder?: string
): Promise<string> {
  return activeProvider.upload(file, folder);
}

/**
 * Delete an image from the active provider
 * @param url - The full URL of the image to delete
 */
export async function deleteImage(url: string): Promise<void> {
  return activeProvider.delete(url);
}

/**
 * Get an optimized image URL for display
 * @param url - The original image URL
 * @param options - Transformation options
 * @returns The optimized/transformed URL
 */
export function getOptimizedUrl(
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "avif" | "jpg" | "png";
  }
): string {
  return activeProvider.getOptimizedUrl(url, options);
}

/**
 * Validate an image file before upload
 * @param file - The file to validate
 * @returns true if valid, throws if invalid
 */
export function validateImageFile(file: File): boolean {
  return activeProvider.validate(file);
}

// ─── Types ────────────────────────────────────────────────────
export type { ImageProvider };

// Re-export for convenience
export { imagekitProvider };
