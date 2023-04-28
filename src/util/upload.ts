import { NFTStorage } from "nft.storage";

export const uploadJson = async (object: string) => {
  try {
    console.log('Uploading manifest...');
    const token = process.env.NEXT_PUBLIC_STORAGE_KEY as string
    const client = new NFTStorage({ token });

    const manifestObject = JSON.parse(object);
    if (!manifestObject) return undefined;

    const manifestBuffer = Buffer.from(JSON.stringify(manifestObject));
    const cid = await client.storeBlob(new Blob([manifestBuffer]));
    const link = `https://${cid}.ipfs.dweb.link`;
    console.log(`🎉 Uploaded manifest: ${link}`);
    return link;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const uploadFile = async (image: any) => {
  const token = process.env.NEXT_PUBLIC_STORAGE_KEY as string
  const client = new NFTStorage({ token });

  let uploadFile = image
  if (image.blob) {
    // Convert blob to file
    const fileName = `image_blob.jpeg`;
    const fileType = 'image/jpeg';
    uploadFile = new File([image.blob], fileName, { type: fileType });
  }
  console.log(`Uploading image: ${uploadFile.name}`);
  const metadata = await client.store({
    name: 'My sweet NFT',
    description: "Just try to funge it. You can't do it.",
    image,
  });
  const rawURL = metadata.embed().image;
  const masala = rawURL.toString().split('/ipfs/')[1];
  const imageURL = `https://ipfs.io/ipfs/${masala}`;
  console.log(`🎉 Uploaded image ${imageURL}`);
  return imageURL;
};
