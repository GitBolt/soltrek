import React, { useState, useEffect, FC } from "react";
import {
  Position,
  NodeProps,
  useNodeId,
  useReactFlow,
  Connection,
} from "reactflow";
import BaseNode from "@/layouts/BaseNode";
import { Keypair } from "@solana/web3.js";
import b58 from "bs58";
import { CustomHandle } from "@/layouts/CustomHandle";
import { handleValue } from "@/util/handleNodeValue";
import { mnemonicToKp } from "@/util/helper";
import { Box, Flex, Text } from "@chakra-ui/react";

const Mnemonic: FC<NodeProps> = (props) => {
  const [pk, setPk] = useState<string>('');
  const [phrase, setPhrase] = useState<string>('');

  const [outputNodes, setOutputNodes] = useState<string[]>(
    []
  );
  const { setNodes, getNode, getEdges } = useReactFlow();
  const id = useNodeId();

  const currentNode = getNode(id as string);

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
    const nodeKeys: string[] = Object.keys(currentNode?.data || {});
    const edges = getEdges()
    const values = handleValue(currentNode, edges, ["import"])

    const mnemonic = values["import"]
    if (mnemonic) {
      let result
      try {
        result = mnemonicToKp(mnemonic.trim())
      } catch {
        try {
          result = mnemonicToKp()
        } catch (e) {
          console.log(e)
        }
      }
      setPhrase(result?.generatedMnemonic || '')
      setPk(result ? b58.encode(result.privateKey as Uint8Array) : '')
    }

    nodeKeys.forEach((key) => {
      if (key.startsWith("btn") && currentNode?.data[key] == true) {
        const m = mnemonicToKp()
        setPk(b58.encode(m.privateKey));
        setPhrase(m.generatedMnemonic as string)
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);

  const handleConnect = (e: Connection) => {
    if (!e.target) return;
    updateNodeData(e.target, pk);
    setOutputNodes([...outputNodes, e.target]);
  };


  useEffect(() => {
    outputNodes.forEach((target) =>
      updateNodeData(target, pk)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pk]);


  const cleanedCode = mnemonicToKp.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const destroyPosition = ${cleanedCode}`;


  return (
    <BaseNode code={CODE} {...props} title="Mnemonic">
      <Flex padding="1rem 12rem" fontSize="1rem" color="white" flexWrap="wrap" justify="space-around" gap="1rem">
        {phrase.split(" ").map((word) => (
          <Box key={word} flex="1 0 25%" w="1rem" bg="blue.400" p="0.5rem 0.5rem" borderRadius="1rem"><Text>{word}</Text></Box>
        ))}
      </Flex>
      <CustomHandle
        pos="left"
        type="target"
        id="import"
        label="Mnemonic (Import)"
        style={{ marginTop: "-0.7rem" }}
      />

      <CustomHandle
        pos="left"
        type="target"
        id="run"
        label="Generate"
        style={{ marginTop: "2.5rem" }}
      />

      <CustomHandle
        pos="right"
        type="source"
        id="privKey"
        label="Private Key"
        onConnect={(e: any) => handleConnect(e)}
      />
    </BaseNode>
  );
};

export default Mnemonic;
