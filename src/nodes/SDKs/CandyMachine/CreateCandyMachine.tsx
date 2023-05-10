


import React, { useState, useEffect, FC } from "react";
import {
  fetchCandyMachine,
  fetchCandyGuard,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { NodeProps, useNodeId, useReactFlow, Connection as RCon } from "reactflow";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { handleValue } from "@/util/handleNodeValue";
import { HXRO } from "@/sdks/hxro";
import { Text } from "@chakra-ui/react";
import { SDKResponse } from "@/types/response";
import base58 from "bs58";
import { useNetworkContext } from "@/context/configContext";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { publicKey } from "@metaplex-foundation/umi";
import {
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { create, createCandyMachineV2 } from "@metaplex-foundation/mpl-candy-machine";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { Metaplex, keypairIdentity, toBigNumber } from "@metaplex-foundation/js";

const CreateCandyMachine: FC<NodeProps> = (props) => {
  const { getNode, getEdges, setNodes, setEdges } = useReactFlow();
  const id = useNodeId();
  const currentNode = getNode(id as string);
  const { selectedNetwork } = useNetworkContext()

  const [address, setAddress] = useState<any>();
  const [error, setError] = useState<any>('');
  const [sigOutputs, setSigOutputs] = useState<string[]>([])


  const updateNodeData = (nodeId: string, data: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            [id as string]: data,
          };
        }
        return node;
      })
    );
  };


  const onConnect = (e: RCon) => {
    if (!e.target) return
    setSigOutputs([...sigOutputs, e.target])
    updateNodeData(e.target, address)
  };



  useEffect(() => {
    sigOutputs.forEach((target) => updateNodeData(target, address));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, error]);


  useEffect(() => {
    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "configs",
      "kp",
      "run"
    ]);

    const dataKeys: string[] = Object.keys(currentNode?.data || {});

    const shouldRun = dataKeys.find(
      (key) => key.startsWith("btn") && currentNode?.data[key] == true
    );

    if (!values["configs"] || !values["kp"] || !shouldRun) return;



    const configs = values["configs"]
    let privKey = values["kp"]
    let parsed: any

    try {
      parsed = new Uint8Array(base58.decode(privKey))
    } catch {
      try {
        parsed = new Uint8Array(JSON.parse(privKey))
      } catch (e) {
        console.log("Keypair Error: ", e)
      }
    }
    console.log(selectedNetwork)
    const connection = new Connection(selectedNetwork);
    const metaplex = new Metaplex(connection);
    metaplex.use(keypairIdentity(Keypair.fromSecretKey(parsed)))

    const run = async () => {
      // Create the Collection NFT.

      try {
        const { nft: collectionNft } = await metaplex.nfts().create({

          name: "My Collection NFT",
          uri: "https://bafkreic6e7wwviz7acm37qwlgspfgq7jgoowt2iy7l3jspkwln3ra37w3e.ipfs.nftstorage.link/",
          sellerFeeBasisPoints: configs.sellerFeeBasisPoints * 100,
        }, { commitment: "finalized" });

        console.log(collectionNft)
        // Create the Candy Machine.
        const { candyMachine } = await metaplex.candyMachines().create({

          itemsAvailable: toBigNumber(configs.itemsAvailable),
          sellerFeeBasisPoints: configs.sellerFeeBasisPoints * 100, // 3.33%
          collection: {
            address: collectionNft.address,
            updateAuthority: metaplex.identity(),
          },
        }, { commitment: "finalized" });

        
        console.log(candyMachine)

        setAddress(candyMachine.address.toBase58())
      }
      catch (e: any) {
        setError(e.toString())
      }
    }

    run()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);


  const cleanedCode = HXRO.destroyPosition.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const destroyPosition = ${cleanedCode}`;

  return (
    <BaseNode
      code={CODE}
      {...props}
      height="15rem"
      title="Candy Machine - Create"

    >
      {error ?
        <Text fontSize="1.5rem" transform="translate(7rem, 3rem)" mr="10rem" zIndex="3" color="blue.400" maxW="30rem" fontWeight={600}>{error.toLocaleString()}</Text> : null}

      <CustomHandle
        pos="left"
        type="target"
        style={{ marginTop: "-3rem" }}
        id="run"
        label="Run"
      />

      <CustomHandle
        pos="left"
        type="target"
        style={{ marginTop: "0.5rem" }}
        id="configs"
        label="Configurations"
      />

      <CustomHandle
        pos="left"
        type="target"
        id="kp"
        style={{ marginTop: "4rem" }}
        label="Authority (Private Key)"
      />

      <CustomHandle
        pos="left"
        type="target"
        id="kp"
        style={{ marginTop: "4rem" }}
        label="Authority (Private Key)"
      />

      <CustomHandle
        pos="right"
        type="source"
        id="address"
        onConnect={onConnect}
        label="Address"
      />

    </BaseNode>
  );
};

export default CreateCandyMachine;


