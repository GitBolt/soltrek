import React, { useState, useEffect, FC } from 'react';
import { Handle, Position, NodeProps, useNodes, useNodeId, useReactFlow, Connection } from 'reactflow';
import BaseNode from '@/layout/BaseNode';
import { Text } from '@chakra-ui/react';
import { Keypair } from '@solana/web3.js';
import b58 from 'bs58';
import { CustomHandle } from '@/layout/CustomHandle';

const KeypairNode: FC<NodeProps> = (props) => {
  const [kp, setKp] = useState<Keypair>(new Keypair());
  const [currentTargetPrivKey, setCurrentTargetPrivKey] = useState<string[]>([])
  const [currentTargetPubKey, setCurrentTargetPubKey] = useState<string[]>([])
  const { setNodes, getNode } = useReactFlow()
  const nodeId = useNodeId()
  const nodes = useNodes()

  const currentNodeObj = nodes.find((node) => node.id == nodeId)


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


  useEffect(() => {
    if (!nodeId) return
    const currentNode = getNode(nodeId)
    const symbolData: string[] = Object.keys(currentNode?.data)
    if (symbolData && symbolData.length) {
      symbolData.forEach((key) => {
        if (key.startsWith('btn')) {
          if (currentNode?.data[key] == true) {
            setKp(new Keypair())
          }
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeObj?.data])


  const handleConnectPubKey = (e: Connection) => {
    if (!e.target) return
    updateNodeData(e.target, kp.publicKey.toBase58())
    setCurrentTargetPubKey([...currentTargetPubKey, e.target])

  };
  

  const handleConnectPrivKey = (e: Connection) => {
    if (!e.target) return
    updateNodeData(e.target, b58.encode(kp.secretKey))
    setCurrentTargetPrivKey([...currentTargetPrivKey, e.target])

  };

  useEffect(() => {
    currentTargetPrivKey.forEach((target) => updateNodeData(target, b58.encode(kp.secretKey)))
    currentTargetPubKey.forEach((target) => updateNodeData(target, kp.publicKey.toBase58()))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kp])



  return (
    <BaseNode {...props} title="Keypair Object">
      <CustomHandle pos="left" type="target" label="Generate" />
      <CustomHandle pos="right" type="source" id="a" label="Public Key" onConnect={(e: any) => handleConnectPubKey(e)} style={{ marginTop: "-0.7rem" }} />
      <CustomHandle pos={Position.Right} type="source" id="b" label="Private Key" onConnect={(e: any) => handleConnectPrivKey(e)} style={{ marginTop: "2.5rem" }} />
    </BaseNode >
  );
};

export default KeypairNode;
