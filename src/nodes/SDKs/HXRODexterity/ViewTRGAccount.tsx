import React, { useState, useEffect, FC } from "react";
import { NodeProps, useNodeId, useReactFlow, Connection as RCon } from "reactflow";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { handleValue } from "@/util/handleNodeValue";
import { HXRO } from "@/sdks/hxro";
import { Button, Text } from "@chakra-ui/react";
import { SDKResponse } from "@/types/response";
import base58 from "bs58";
import { useNetworkContext } from "@/context/configContext";
import { HXRODexterity } from "@/sdks/hxroDexterity";
import { PublicKey } from "@metaplex-foundation/js";

const DexViewTRG: FC<NodeProps> = (props) => {
  const { getNode, getEdges, setNodes, setEdges } = useReactFlow();
  const id = useNodeId();
  const currentNode = getNode(id as string);

  const { selectedNetwork } = useNetworkContext()

  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [targetNodes, setTargetNodes] = useState<string[]>([])


  // Update target nodes (accepting input) data with 100ms delay (required to work properly)
  const updateNodeData = (nodeIds: string[]) => {
    setTimeout(() => {
      setNodes(nodes => nodes.map(node =>
        nodeIds.includes(node.id)
          ? { ...node, data: { ...node.data, [id as string]: address } }
          : node
      ));
    }, 100);
  };

  // Updating a new input node with data from this node as soon as it's connected
  const onConnect = (e: RCon) => {
    if (!e.target) return
    setTargetNodes([...targetNodes, e.target])
    updateNodeData([e.target])
  };

  // Pushing new data to all input nodes connected
  useEffect(() => {
    if (!targetNodes) return
    updateNodeData(targetNodes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])


  useEffect(() => {
    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "privateKey",
      "trgPubkey"
    ]);
    console.log(values)
    if (!values["privateKey"] || !values["trgPubkey"]) return;

    setEdges((edgs) =>
      edgs.map((ed) => {
        if (ed.source == id) {
          ed.animated = true;
          return ed;
        }
        return ed;
      })
    );

    HXRODexterity.viewTRGAcount(
      selectedNetwork,
      new Uint8Array(base58.decode(values["privateKey"])),
      new PublicKey(values["trgPubkey"])
    ).then((res) => {
      console.log("SDK Res: ", res)
      //   setAddress(res)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);


  const cleanedCode = HXRODexterity.viewTRGAcount.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const viewTRGAcount = ${cleanedCode}`;
  return (
    <BaseNode
      code={CODE}
      {...props}
      title="HXRO - View TRG"
      >
      {error ?
        <Text fontSize="1.5rem" transform="translate(0, 3rem)" zIndex="3" color="blue.400" fontWeight={600}>{error.toLocaleString()}</Text> : null}

      <CustomHandle
        pos="left"
        type="target"
        id="trgPubkey"
        label="TRG Address"
        style={{ marginTop: "-1rem" }}

      />

      <CustomHandle
        pos="left"
        type="target"
        id="privateKey"
        label="Private Key"
        style={{ marginTop: "2rem" }}

      />
    </BaseNode>
  );
};

export default DexViewTRG;
