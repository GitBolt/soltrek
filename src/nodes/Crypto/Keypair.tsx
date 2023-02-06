import React, { useState, useEffect, FC } from 'react';
import { Handle, Position, NodeProps, useNodes, useNodeId, useReactFlow, Connection } from 'reactflow';
import BaseNode from '@/layout/BaseNode';
import { Text } from '@chakra-ui/react';
import { Keypair } from '@solana/web3.js';
import b58 from 'bs58';

const KeypairNode: FC<NodeProps> = (props) => {
  const [kp, setKp] = useState<Keypair>(new Keypair());
  const { setNodes } = useReactFlow()
  const nodeId = useNodeId()
  const nodes = useNodes()


  const updateNodeData = (nodeId: string, data: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            data,
          };
        }
        return node;
      }))
  }

  const handleConnectPubKey = (e: Connection) => {
    if (!e.target) return
    updateNodeData(e.target, kp.publicKey.toBase58())
  };


  const handleConnectPrivKey = (e: Connection) => {
    if (!e.target) return
    updateNodeData(e.target, b58.encode(kp.secretKey))
  };


  return (
    <BaseNode {...props} title="Keypair Object">
      <Handle position={Position.Left} type="target" />
      <Handle position={Position.Right} type="source" id="a" onConnect={(e) => handleConnectPubKey(e)} style={{ marginTop: "-0.7rem" }} />
      <Handle position={Position.Right} type="source" id="b" onConnect={(e) => handleConnectPrivKey(e)} style={{ marginTop: "2.5rem" }} />
    </BaseNode >
  );
};

export default KeypairNode;
