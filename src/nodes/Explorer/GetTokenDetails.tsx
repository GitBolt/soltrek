import React, { useState, useEffect, FC } from 'react';
import { Handle, Position, NodeProps, useNodes, useNodeId, useReactFlow } from 'reactflow';
import BaseNode from '@/layout/BaseNode';
import { Text } from '@chakra-ui/react';

const GetTokenDetailsNode: FC<NodeProps> = (props) => {
  const [tokenDetails, setTokenDetails] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string>('');
  const { getNode } = useReactFlow()
  const nodeId = useNodeId()
  const nodes = useNodes()

  const currentNodeObj = nodes.find((node) => node.id == nodeId)


  useEffect(() => {
    if (!nodeId) return
    const currentNode = getNode(nodeId)
    console.log(currentNode)
    const symbolData: string[] = Object.values(currentNode?.data)
    if (symbolData && symbolData.length) {
      fetch(`https://hyper.solana.fm/v3/token?address=${symbolData.join(',')}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data) {
            setTokenDetails(undefined)
            console.log("error")
            setError("Token not supported")
          } else {
            setTokenDetails(JSON.stringify(data, null, 4));
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {
      setTokenDetails(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeObj?.data])

  return (
    <BaseNode {...props} title="Fetch Token Mint Details">
      {tokenDetails ?
        <Text fontSize="1rem" color="blue.500" whiteSpace="pre-wrap">{tokenDetails.toLocaleString()}</Text> :
        <Text color="gray.100" fontSize="1.5rem">{error || 'Nothing to show here...'}</Text>}
      <Handle position={Position.Left} type="target" />
    </BaseNode >
  );
  
};

export default GetTokenDetailsNode;
