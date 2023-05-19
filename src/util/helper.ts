import { PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor"
import * as bip39 from 'bip39';
import * as ed25519 from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import { IDLData, IDLType } from "@/types/idl";

// ChatGPT wrote this horrible code, but it works so I'm not touching it
export const stringify = (value: any, indent = 2): string => {
  const spaces = ' '.repeat(indent);

  if (typeof value === 'object' && value !== null) {
    if (typeof value.toJSON === 'function') {
      return stringify(value.toJSON());
    } else if (Array.isArray(value)) {
      const arrayValues = value.map((v: any) => stringify(v, indent)).join(`,\n${spaces}`);
      return `[\n${spaces}${arrayValues}\n]`;
    } else {
      const objectValues = Object.entries(value)
        .map(([key, val]) => `${spaces}${stringify(key)}: ${stringify(val, indent)}`)
        .join(`,\n`);
      return `{\n${objectValues}\n}`;
    }
  } else if (typeof value === 'string') {
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  } else {
    return String(value);
  }
};


export const getProvider = (wallet: anchor.Wallet, rpc_url?: string) => {
  const opts = {
    preflightCommitment: 'processed' as anchor.web3.ConfirmOptions,
  };
  const connectionURI =
    rpc_url || process.env.NEXT_PUBLIC_DEFAULT_RPC as string
  const connection = new anchor.web3.Connection(
    connectionURI,
    opts.preflightCommitment
  );
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    opts.preflightCommitment
  );
  return provider;
};

export const getProgram = async (protocolAddress: PublicKey, wallet: anchor.Wallet, rpc_url?: string) => {
  const provider = getProvider(wallet, rpc_url)
  const program = await anchor.Program.at(protocolAddress, provider);
  return program
}

export const anchorProgram = (wallet: anchor.Wallet, network?: string) => {
  const provider = getProvider(wallet, network || process.env.NEXT_PUBLIC_DEFAULT_RPC);
  const idl = IDLData as anchor.Idl;
  const program = new anchor.Program(
    idl,
    new PublicKey(IDLData.metadata.address),
    provider
  ) as unknown as anchor.Program<IDLType>;

  return program;
};


export const parseProtocolNumber = (protocolNumber: anchor.BN) =>
  new anchor.BN(protocolNumber).toNumber() / 10 ** 9;


export const getKeyByValue = (object: any, value: any) => {
  return Object.keys(object).find(key => object[key] === value);
}

export const truncatedPublicKey = (publicKey: string, length?: number) => {
  if (!publicKey) return;
  if (!length) {
    length = 5;
  }
  return publicKey.replace(publicKey.slice(length, 44 - length), '...');
};

export const getNetworkName = (rpc_url: string) => {
  if (!rpc_url) return

  const lowerCaseInput = rpc_url.toLowerCase();
  if (lowerCaseInput.includes("devnet")) {
    return "Devnet";
  } else if (lowerCaseInput.includes("mainnet")) {
    return "Mainnet-Beta";
  } else if (lowerCaseInput.includes("testnet")) {
    return "Testnet";
  } else if (lowerCaseInput.includes("http://127")) {
    return "Localnet";
  } else {
    return "Custom RPC"
  }
}


export const mnemonicToKp = (mnemonic?: string) => {
  const derivePath = "m/44'/501'/0'/0'";

  let generatedMnemonic = mnemonic
  if (!mnemonic) {
    generatedMnemonic = bip39.generateMnemonic();
  }

  const seed = bip39.mnemonicToSeedSync(generatedMnemonic as string);
  const derivedSeed = ed25519.derivePath(derivePath, seed.toString('hex')).key;
  const keypair = Keypair.fromSeed(derivedSeed);
  return {
    publicKey: keypair.publicKey.toBase58(),
    privateKey: keypair.secretKey,
    generatedMnemonic,
  };
};

export const dataURItoBlob = (dataURI: string) => {
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
  else
      byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], {type:mimeString});
}