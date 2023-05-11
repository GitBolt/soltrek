


import React, { useState, useEffect, FC } from "react";
import { NodeProps, useNodeId, useReactFlow, Connection as RCon } from "reactflow";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { handleValue } from "@/util/handleNodeValue";
import { Text } from "@chakra-ui/react";
import base58 from "bs58";
import { useNetworkContext } from "@/context/configContext";
import { PublicKey } from "@solana/web3.js";


import { CandyMachine } from "@/sdks/candyMachine";

const DeleteCandyMachine: FC<NodeProps> = (props) => {
  const { getNode, getEdges, setNodes } = useReactFlow();
  const id = useNodeId();
  const currentNode = getNode(id as string);
  const { selectedNetwork } = useNetworkContext()

  const [signature, setSignature] = useState<any>();
  const [error, setError] = useState<any>('');
  const [targetNodes, setTargetNodes] = useState<string[]>([])


  // Update target nodes (accepting input) data with 100ms delay (required to work properly)
  const updateNodeData = (nodeIds: string[], data: any) => {
    setTimeout(() => {
      setNodes(nodes => nodes.map(node =>
        nodeIds.includes(node.id)
          ? { ...node, data: { ...node.data, [id as string]: data } }
          : node
      ));
    }, 100);
  };


  const onConnect = (e: RCon) => {
    if (!e.target) return
    setTargetNodes([...targetNodes, e.target])
    updateNodeData([e.target], signature)
  };



  useEffect(() => {
    if (!targetNodes) return
    updateNodeData(targetNodes, signature)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);


  useEffect(() => {
    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "cmAddress",
      "guardAddress",
      "authority"
    ]);

    const dataKeys: string[] = Object.keys(currentNode?.data || {});
    const shouldRun = dataKeys.find(
      (key) => key.startsWith("btn") && currentNode?.data[key] == true
    );

    if (Object.values(values).filter(i => i).length != 3 || !shouldRun) return;

    let privKey = values["authority"]
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
    
    const run = async () => {
      const res = await CandyMachine.deleteCandyMachine(
        selectedNetwork,
        parsed,
        new PublicKey(values["cmAddress"]),
        new PublicKey(values["guardAddress"])
      )
      if (res.error) {
        setError(res.error)
        return
      }

      setSignature(res.res)
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);


  const cleanedCode = CandyMachine.deleteCandyMachine.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const deleteCandyMachine = ${cleanedCode}`;

  return (
    <BaseNode
      code={CODE}
      {...props}
      height="20rem"
      title="Candy Machine - Delete"

    >
      {error ?
        <Text fontSize="1.5rem" transform="translate(7rem, 3rem)" mr="10rem" zIndex="3" color="blue.400" maxW="30rem" fontWeight={600}>{error.toLocaleString()}</Text> : null}

      <CustomHandle
        pos="left"
        type="target"
        style={{ marginTop: "-5rem" }}
        id="run"
        label="Run"
      />

      <CustomHandle
        pos="left"
        type="target"
        style={{ marginTop: "-1rem" }}
        id="authority"
        label="Authority (Private Key)"
      />

      <CustomHandle
        pos="left"
        type="target"
        id="cmAddress"
        style={{ marginTop: "3rem" }}
        label="Candy Machine Address"
      />

      <CustomHandle
        pos="left"
        type="target"
        id="guardAddress"
        style={{ marginTop: "7rem" }}
        label="Guard Address"
      />

      <CustomHandle
        pos="right"
        type="source"
        id="res"
        onConnect={onConnect}
        label="Response"
      />

    </BaseNode>
  );
};

export default DeleteCandyMachine;