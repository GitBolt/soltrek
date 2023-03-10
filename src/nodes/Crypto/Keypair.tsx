import React, { useState, useEffect, FC } from "react";
import {
  Handle,
  Position,
  NodeProps,
  useNodeId,
  useReactFlow,
  Connection,
} from "reactflow";
import BaseNode from "@/layout/BaseNode";
import { Text } from "@chakra-ui/react";
import { Keypair } from "@solana/web3.js";
import b58 from "bs58";
import { CustomHandle } from "@/layout/CustomHandle";

const KeypairNode: FC<NodeProps> = (props) => {
  const [kp, setKp] = useState<Keypair>(new Keypair());

  const [currentTargetPrivKey, setCurrentTargetPrivKey] = useState<string[]>(
    []
  );
  const [currentTargetPubKey, setCurrentTargetPubKey] = useState<string[]>([]);
  const { setNodes, getNode } = useReactFlow();
  const nodeId = useNodeId();

  const currentNode = getNode(nodeId as string);

  const updateNodeData = (nodeId: string, data: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            [nodeId]: data,
          };
        }
        return node;
      })
    );
  };

  useEffect(() => {
    const nodeKeys: string[] = Object.keys(currentNode?.data || {});
    nodeKeys.forEach((key) => {
      if (key.startsWith("btn") && currentNode?.data[key] == true) {
        setKp(new Keypair());
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);

  const handleConnectPubKey = (e: Connection) => {
    if (!e.target) return;
    updateNodeData(e.target, kp.publicKey.toBase58());
    setCurrentTargetPubKey([...currentTargetPubKey, e.target]);
  };

  const handleConnectPrivKey = (e: Connection) => {
    if (!e.target) return;
    updateNodeData(e.target, b58.encode(kp.secretKey));
    setCurrentTargetPrivKey([...currentTargetPrivKey, e.target]);
  };

  useEffect(() => {
    currentTargetPrivKey.forEach((target) =>
      updateNodeData(target, b58.encode(kp.secretKey))
    );
    currentTargetPubKey.forEach((target) =>
      updateNodeData(target, kp.publicKey.toBase58())
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kp]);

  const KeypairCode = `
  const generateKeypair = ()=>{
    const kp = new Keypair()
    const { publicKey, secretKey } = kp;
  }
  `;

  return (
    <BaseNode code={KeypairCode} {...props} title="Keypair Object">
      <CustomHandle pos="left" type="target" id="generate" label="Generate" />

      <CustomHandle
        pos="right"
        type="source"
        id="public_key"
        label="Public Key"
        onConnect={(e: any) => handleConnectPubKey(e)}
        style={{ marginTop: "-0.7rem" }}
      />

      <CustomHandle
        pos={Position.Right}
        type="source"
        id="private_key"
        label="Private Key"
        onConnect={(e: any) => handleConnectPrivKey(e)}
        style={{ marginTop: "2.5rem" }}
      />
    </BaseNode>
  );
};

export default KeypairNode;
