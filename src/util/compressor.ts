export const compressImage = (blob: Blob, options = {}): Promise<Blob> => {
  const defaults = {
    maxWidth: 500,
    maxHeight: 500,
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

      if (width > settings.maxWidth) {
        height *= settings.maxWidth / width;
        width = settings.maxWidth;
      }
      if (height > settings.maxHeight) {
        width *= settings.maxHeight / height;
        height = settings.maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      ctx!.imageSmoothingEnabled = false;
      ctx!.drawImage(image, 0, 0, width, height);

      canvas.toBlob((compressedBlob) => {
        const reductionRatio = 1 - (compressedBlob!.size / blob.size);
        console.log(`Input image size: ${(blob.size / 1024).toFixed(2)} KB`);
        console.log(`Output image size: ${(compressedBlob!.size / 1024).toFixed(2)} KB (${(reductionRatio * 100).toFixed(2)}% reduction)`);

        resolve(compressedBlob!);
      }, settings.format);
    };

    image.onerror = (error) => {
      reject(error);
    };

    image.src = URL.createObjectURL(blob);
  });
};


export const blobToBase64 = (img: Blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  return new Promise(resolve => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};
