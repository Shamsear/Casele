/**
 * Cloudflare R2 Provider (Placeholder)
 * 
 * Ready to activate when you switch from ImageKit.
 * Just change ACTIVE_PROVIDER in image-service.ts to "r2".
 * 
 * Docs: https://developers.cloudflare.com/r2/api/s3/api/
 * 
 * Note: Run `npm install @aws-sdk/client-s3` before activating this provider.
 */

import type { ImageProvider } from "./imagekit";

// ─── Config ───────────────────────────────────────────────────
const R2_ENDPOINT = process.env.R2_ENDPOINT || "";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "";
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

// ─── Helpers ──────────────────────────────────────────────────
function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop() || "jpg";
  return `${timestamp}-${random}.${extension}`;
}

// Dynamic import helper - uses eval to avoid TypeScript resolution errors
// when @aws-sdk/client-s3 is not installed
async function loadSDK() {
  try {
    // eslint-disable-next-line no-new-func
    const importFn = new Function("specifier", "return import(specifier)");
    return await importFn("@aws-sdk/client-s3");
  } catch {
    throw new Error(
      "AWS SDK not installed. Run: npm install @aws-sdk/client-s3"
    );
  }
}

// ─── R2 Provider Implementation ───────────────────────────────
export const r2Provider: ImageProvider = {
  /**
   * Upload an image to R2
   */
  async upload(file: File, folder?: string): Promise<string> {
    const sdk = await loadSDK();
    const { S3Client, PutObjectCommand } = sdk;

    const client = new S3Client({
      endpoint: R2_ENDPOINT,
      region: "auto",
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });

    const fileName = generateFileName(file.name);
    const folderPath = folder || "products";
    const key = `${folderPath}/${fileName}`;

    const buffer = await file.arrayBuffer();

    await client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    return `${R2_PUBLIC_URL}/${key}`;
  },

  /**
   * Delete an image from R2
   */
  async delete(url: string): Promise<void> {
    const sdk = await loadSDK();
    const { S3Client, DeleteObjectCommand } = sdk;

    const client = new S3Client({
      endpoint: R2_ENDPOINT,
      region: "auto",
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });

    const key = url.replace(`${R2_PUBLIC_URL}/`, "");

    await client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      })
    );
  },

  /**
   * Get an optimized image URL using Cloudflare Image Resizing
   */
  getOptimizedUrl(
    url: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
      format?: "webp" | "avif" | "jpg" | "png";
    }
  ): string {
    if (!options) return url;

    const params = new URLSearchParams();
    if (options.width) params.append("width", options.width.toString());
    if (options.height) params.append("height", options.height.toString());
    if (options.quality) params.append("quality", options.quality.toString());
    if (options.format) params.append("format", options.format);

    const paramString = params.toString();
    return paramString ? `${url}?${paramString}` : url;
  },

  /**
   * Validate an image file
   */
  validate(file: File): boolean {
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB (max 5MB)`
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(
        `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF`
      );
    }

    return true;
  },
};
