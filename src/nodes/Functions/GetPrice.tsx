import React, { useState, useEffect, FC } from 'react';
import { Position, NodeProps, useNodes, useNodeId, useReactFlow, Connection } from 'reactflow';
import BaseNode from '@/layouts/BaseNode';
import { Text } from '@chakra-ui/react';
import { CustomHandle } from '@/layouts/CustomHandle';

const GetPriceNode: FC<NodeProps> = (props) => {
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
            [nodeId as string]: price,
          };
        }
        return node;
      }))
  }

  const CustomHandleConnect = (e: Connection) => {
    if (!e.target) return
    updateNodeData(e.target)
  };

  useEffect(() => {
    if (!nodeId) return
    const currentNode = getNode(nodeId)
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
    <BaseNode {...props} title="Fetch Price">
      {price ?
        <Text fontSize="2rem" color="blue.500">${price.toLocaleString()}</Text> :
        <Text color="gray.100" fontSize="1.8rem">{error || 'Empty...'}</Text>}
      <CustomHandle pos={Position.Left} type="target" />
      <CustomHandle pos={Position.Right} type="source" onConnect={(e: any) => CustomHandleConnect(e)} />
    </BaseNode >
  );
};

export default GetPriceNode;
