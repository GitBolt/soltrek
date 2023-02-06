import React, { useState, useEffect, FC } from 'react';
import { Handle, Position, NodeProps, useNodes, useNodeId, useReactFlow, Connection } from 'reactflow';
import BaseNode from '@/layout/BaseNode';
import { Text } from '@chakra-ui/react';

const TextOutputNode: FC<NodeProps> = (props) => {
  const [text, setText] = useState<string | undefined>(undefined);
  const { getNode } = useReactFlow()
  const nodeId = useNodeId()
  const nodes = useNodes()

  const currentNodeObj = nodes.find((node) => node.id == nodeId)

  useEffect(() => {
    if (!nodeId) return
    const currentNode = getNode(nodeId)
    console.log(currentNode)
    const symbolData: string[] = Object.values(currentNode?.data)
    setText(symbolData[0])
    console.log(symbolData[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeObj?.data])

  return (
    <BaseNode {...props} title="Text output">
      {text ?
        <Text fontSize="1.5rem" color="blue.500" maxW="85%" whiteSpace="nowrap">{text}</Text> :
        <Text color="gray.100" fontSize="1.8rem">Nothing to show here...</Text>}
      <Handle position={Position.Left} type="target" />
    </BaseNode >
  );
};

export default TextOutputNode;
