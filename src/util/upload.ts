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