import React, { useState, useEffect, FC } from 'react';
import { Handle, Position, NodeProps, useNodes, useNodeId, useReactFlow, Connection } from 'reactflow';
import BaseNode from '@/layout/BaseNode';
import { Box, Text } from '@chakra-ui/react';

const ColorOutputNode: FC<NodeProps> = (props) => {
  const [color, setColor] = useState<string | undefined>(undefined);
  const { getNode } = useReactFlow()
  const nodeId = useNodeId()
  const nodes = useNodes()

  const currentNodeObj = nodes.find((node) => node.id == nodeId)

  useEffect(() => {
    if (!nodeId) return
    const currentNode = getNode(nodeId)
    console.log(currentNode)
    const symbolData: string[] = Object.values(currentNode?.data)
    setColor(symbolData[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeObj?.data])

  return (
    <BaseNode {...props} title="Colour output / display">
      <Box bgColor={color || '#FFFFFF'} w="15rem" h="5rem" borderRadius="1rem"/>
      <Handle position={Position.Left} type="target" />
    </BaseNode >
  );
};

export default ColorOutputNode;
