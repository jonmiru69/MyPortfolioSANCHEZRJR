/**
 * Media Pipeline & Client-Side Image Compression
 * WebP conversion, canvas resizing, PDF size warnings, alt-text & context enforcement.
 */

export const REPO_BUDGET_BYTES = 300 * 1024 * 1024; // 300 MB Soft Budget
export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB Hard Block
export const PDF_WARNING_BYTES = 5 * 1024 * 1024;   // 5 MB Warning Threshold

/**
 * Compress an image file to WebP and scale to max dimension of 1600px
 */
export async function processImageUpload(file, options = {}) {
  const maxDimension = options.maxDimension || 1600;
  const quality = options.quality || 0.82;

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File size (${(file.size / 1024 / 1024).toFixed(1)} MB) exceeds the 20 MB absolute limit.`);
  }

  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Export to WebP
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas image compression failed.'));
            }
            const compressedSize = blob.size;
            const savingsPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

            resolve({
              blob,
              originalSize,
              compressedSize,
              savingsPercent,
              width,
              height,
              dataUrl: canvas.toDataURL('image/webp', quality)
            });
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('Invalid image file format.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validate document / PDF upload
 */
export function validateDocumentUpload(file) {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is ${(file.size / 1024 / 1024).toFixed(1)} MB. Files over 20 MB are blocked to protect repository limits.`
    };
  }

  const isWarning = file.size > PDF_WARNING_BYTES;
  return {
    valid: true,
    warning: isWarning ? `File is ${(file.size / 1024 / 1024).toFixed(1)} MB (over 5 MB). Consider compressing it to ensure fast visitor load.` : null,
    size: file.size
  };
}

/**
 * Format bytes to readable string
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
