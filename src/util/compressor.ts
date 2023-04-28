export const compressImage = (blob: Blob, options = {}): Promise<Blob> => {
  const defaults = {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.8,
    format: 'image/png',
  };
  const settings = { ...defaults, ...options };

  return new Promise((resolve, reject) => {
    const image = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    image.onload = () => {
      let width = image.width;
      let height = image.height;

      // scale the image down if it's larger than the specified max dimensions
      if (width > settings.maxWidth) {
        height *= settings.maxWidth / width;
        width = settings.maxWidth;
      }
      if (height > settings.maxHeight) {
        width *= settings.maxHeight / height;
        height = settings.maxHeight;
      }

      // set the canvas size to match the scaled image size
      canvas.width = width;
      canvas.height = height;

      // draw the scaled image on the canvas with image smoothing disabled
      ctx!.imageSmoothingEnabled = false;
      ctx!.drawImage(image, 0, 0, width, height);

      // convert the canvas to a Blob object with the specified format and quality
      canvas.toBlob((compressedBlob) => {
        const reductionRatio = 1 - (compressedBlob!.size / blob.size);
        console.log(`Input image size: ${(blob.size / 1024).toFixed(2)} KB`);
        console.log(`Output image size: ${(compressedBlob!.size / 1024).toFixed(2)} KB (${(reductionRatio * 100).toFixed(2)}% reduction)`);

        resolve(compressedBlob!);
      }, settings.format, settings.quality);
    };

    image.onerror = (error) => {
      reject(error);
    };

    image.src = URL.createObjectURL(blob);
  });
};
