import React, { useState, useEffect, FC } from "react";
import base58 from "bs58";
import {
  NodeProps,
  useNodeId,
  useReactFlow,
  Connection as RCon
} from "reactflow";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { handleValue } from "@/util/handleNodeValue";
import { Text } from "@chakra-ui/react";
import { useNetworkContext } from "@/context/configContext";
import { HXRODexterity } from "@/sdks/hxroDexterity";

const DexCreateTRG: FC<NodeProps> = (props) => {
  const { getNode, getEdges, setNodes, setEdges } = useReactFlow();
  const id = useNodeId();
  const currentNode = getNode(id as string);

  const { selectedNetwork } = useNetworkContext()

  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
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
    ]);

    const dataKeys: string[] = Object.keys(currentNode?.data || {});
    const run = dataKeys.find(
      (key) => key.startsWith("btn") && currentNode?.data[key] == true
    );

    if (!values["privateKey"] || !run) return;
    setEdges((edgs) =>
      edgs.map((ed) => {
        if (ed.source == id) {
          ed.animated = true;
          return ed;
        }
        return ed;
      })
    );

    HXRODexterity.createTRG(
      selectedNetwork,
      new Uint8Array(base58.decode(values["privateKey"])),
    ).then((res) => {
      console.log("SDK res: ", res)
      if (res.error) {
        setError(res.error)
        return
      }
      setSuccess(`Created TRG`)
      setAddress(res.res)
      setEdges((edgs) =>
        edgs.map((ed) => {
          if (ed.source == id) {
            ed.animated = false;
            return ed;
          }
          return ed;
        })
      );
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);


  const cleanedCode = HXRODexterity.createTRG.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const createTRG = ${cleanedCode}`;

  return (
    <BaseNode
      code={CODE}
      {...props}
      title="HXRO - Create TRG"
    >
      {error ?
        <Text fontSize="1.5rem" transform="translate(0, 3rem)" zIndex="3" color="blue.400" fontWeight={600}>{error.toLocaleString()}</Text> : null}

      <CustomHandle
        pos="left"
        type="target"
        id="run"
        label="Run"
        style={{ marginTop: "-1rem" }}
      />

      <CustomHandle
        pos="left"
        type="target"
        id="privateKey"
        label="Private Key"
        style={{ marginTop: "2rem" }}
      />

      <CustomHandle
        pos="right"
        type="source"
        onConnect={onConnect}
        id="address"
        label="Address"
      />
    </BaseNode>
  );
};

export default DexCreateTRG;
