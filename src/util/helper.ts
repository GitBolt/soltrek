import { Edge, Node } from "reactflow";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor"

export const handleValue = (
  node: Node<any, string | undefined> | undefined,
  edges: Edge[],
  ids: string[]
) => {
  let idValueMap = Object();
  let value_id_map = Object();
  edges.map((e) => {
    value_id_map = {
      ...value_id_map,
      [e.targetHandle as any]: e.source,
    };
  });
  ids.map((e) => {
    idValueMap = {
      ...idValueMap,
      [e]: node?.data[String(value_id_map[e])],
    };
  });
  return idValueMap;
};

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
    rpc_url ||
    'https://solana-devnet.g.alchemy.com/v2/uUAHkqkfrVERwRHXnj8PEixT8792zETN';
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
  }

}