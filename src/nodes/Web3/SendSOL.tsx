import React, { useState, useEffect, FC } from 'react';
import { Handle, Position, NodeProps, useNodes, useNodeId, useReactFlow, Connection } from 'reactflow';
import BaseNode from '@/layout/BaseNode';
import { Text } from '@chakra-ui/react';
import { CustomHandle } from '@/layout/CustomHandle';

const SendSOL: FC<NodeProps> = (props) => {
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string>('');
  const { getNode, setNodes } = useReactFlow()
  const nodeId = useNodeId()
  const nodes = useNodes()

  const currentNodeObj = nodes.find((node) => node.id == nodeId)

  const updateNodeData = (nodeId: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            price,
          };
        }
        return node;
      }))
  }

  const handleConnect = (e: Connection) => {
    if (!e.target) return
    updateNodeData(e.target)
  };

  useEffect(() => {
    if (!nodeId) return
    const currentNode = getNode(nodeId)
    console.log("Transaction: ", currentNode)
    const symbolData: string[] = Object.values(currentNode?.data)
    if (symbolData && symbolData.length) {
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbolData[0]}&vs_currencies=usd`)
        .then((res) => res.json())
        .then((data) => {

          if (!data[symbolData[0]]) {
            setPrice(undefined)
            console.log("error")
            setError("Token not supported")
          } else {
            setPrice(data[symbolData[0]].usd);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {
      setPrice(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeObj?.data])

  return (
    <BaseNode {...props} title="Send SOL (Dummy right now)">
      <CustomHandle pos="left" type="target" label="Private Key"  style={{ marginTop: "-1.8rem" }}/>
      <CustomHandle pos="left" type="target" label="Target Address"  style={{ marginTop: "0.6rem" }} />
      <CustomHandle pos="left" type="target" label="Amount (Lamports)"  style={{ marginTop: "2.9rem" }}/>

      <CustomHandle pos="right" type="source" onConnect={(e: any) => handleConnect(e)}  style={{ marginTop: "0.7rem" }} label="Instruction"/>
    </BaseNode >
  );
};

export default SendSOL;
