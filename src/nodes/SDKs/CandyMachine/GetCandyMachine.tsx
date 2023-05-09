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
import { PublicKey } from "@solana/web3.js";
import { publicKey } from "@metaplex-foundation/umi";


const GetCandyMachine: FC<NodeProps> = (props) => {
  const { getNode, getEdges, setNodes, setEdges } = useReactFlow();
  const id = useNodeId();
  const currentNode = getNode(id as string);
  const { selectedNetwork } = useNetworkContext()

  const [txId, setTxId] = useState<any>();
  const [error, setError] = useState<any>('');
  const [sigOutputs, setSigOutputs] = useState<string[]>([])

  const umi = createUmi(selectedNetwork).use(mplCandyMachine());

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


  useEffect(() => {
    sigOutputs.forEach((target) => updateNodeData(target, txId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txId, error]);


  useEffect(() => {
    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "address",
    ]);

    if (!values["address"]) return;

    fetchCandyMachine(umi, publicKey(values["address"]))
      .then((res) => console.log(res))

    setEdges((edgs) =>
      edgs.map((ed) => {
        if (ed.source == id) {
          ed.animated = true;
          return ed;
        }
        return ed;
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);


  const cleanedCode = HXRO.destroyPosition.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const destroyPosition = ${cleanedCode}`;

  return (
    <BaseNode
      code={CODE}
      {...props}
      title="Candy Machine - Get"

    >
      {error ?
        <Text fontSize="1.5rem" transform="translate(0, 3rem)" zIndex="3" color="blue.400" fontWeight={600}>{error.toLocaleString()}</Text> : null}
      <CustomHandle
        pos="left"
        type="target"
        id="address"
        label="Address"
      />
    </BaseNode>
  );
};

export default GetCandyMachine;
