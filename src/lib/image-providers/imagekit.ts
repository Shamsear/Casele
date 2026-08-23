/**
 * ImageKit Provider
 * 
 * Uses ImageKit's REST API for uploads and transformations.
 * No SDK dependency — just fetch API.
 * 
 * Docs: https://docs.imagekit.io/api-reference/upload-file-api
 */

// ─── Types ────────────────────────────────────────────────────
export interface ImageProvider {
  upload(file: File, folder?: string): Promise<string>;
  delete(url: string): Promise<void>;
  getOptimizedUrl(
    url: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
      format?: "webp" | "avif" | "jpg" | "png";
    }
  ): string;
  validate(file: File): boolean;
}

// ─── Config ───────────────────────────────────────────────────
const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT || "";
const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY || "";
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || "";

// ─── Validation ───────────────────────────────────────────────
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILES = 5;

// ─── Helper: Convert File to Base64 ───────────────────────────
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Helper: Generate unique filename ─────────────────────────
function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop() || "jpg";
  return `${timestamp}-${random}.${extension}`;
}

// ─── ImageKit Provider Implementation ─────────────────────────
export const imagekitProvider: ImageProvider = {
  /**
   * Upload an image to ImageKit
   */
  async upload(file: File, folder?: string): Promise<string> {
    // Validate file
    this.validate(file);

    // Generate filename
    const fileName = generateFileName(file.name);
    const folderPath = folder ? `/${folder}` : "/products";

    // Convert to base64
    const base64 = await fileToBase64(file);

    // Create signature (for production, generate server-side)
    // For now, using unsigned upload with public key
    const formData = new FormData();
    formData.append("file", base64);
    formData.append("fileName", fileName);
    formData.append("folder", folderPath);
    formData.append("useUniqueFileName", "true");

    // Upload to ImageKit using private key for server-side auth
    const authHeader = `Basic ${Buffer.from(
      `${IMAGEKIT_PRIVATE_KEY}:`
    ).toString("base64")}`;

    const response = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `ImageKit upload failed: ${error.message || response.statusText}`
      );
    }

    const result = await response.json();
    return result.url;
  },

  /**
   * Delete an image from ImageKit
   */
  async delete(url: string): Promise<void> {
    // Extract file ID from URL
    // ImageKit URLs: https://ik.imagekit.io/.../folder/filename.jpg
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const folder = urlParts.slice(-2, -1)[0];
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Delete from ImageKit using private key
    const deleteAuth = `Basic ${Buffer.from(
      `${IMAGEKIT_PRIVATE_KEY}:`
    ).toString("base64")}`;

    const response = await fetch(
      `https://upload.imagekit.io/api/v1/files?fileName=${encodeURIComponent(
        filePath
      )}`,
      {
        method: "DELETE",
        headers: {
          Authorization: deleteAuth,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `ImageKit delete failed: ${error.message || response.statusText}`
      );
    }
  },

  /**
   * Get an optimized/transformed image URL
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
    if (!options || (!options.width && !options.height && !options.quality)) {
      return url;
    }

    // ImageKit transformation URL format:
    // https://ik.imagekit.io/your_imagekit_id/tr:w-300,h-200,q-80/absolute-path.jpg
    
    const transforms: string[] = [];
    
    if (options.width) transforms.push(`w-${options.width}`);
    if (options.height) transforms.push(`h-${options.height}`);
    if (options.quality) transforms.push(`q-${options.quality}`);
    if (options.format) transforms.push(`f-${options.format}`);

    // Auto-format and quality for best performance
    transforms.push("f-auto");
    transforms.push("q-auto");

    const transformString = transforms.join(",");

    // Insert transform string after domain
    const urlObj = new URL(url);
    return `${urlObj.origin}/tr:${transformString}${urlObj.pathname}`;
  },

  /**
   * Validate an image file
   */
  validate(file: File): boolean {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB (max 5MB)`);
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(
        `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF`
      );
    }

    return true;
  },
};
