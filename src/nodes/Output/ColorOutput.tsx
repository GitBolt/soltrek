import React, { useState, useEffect, FC } from 'react';
import { Position, NodeProps, useNodes, useNodeId, useReactFlow, Connection } from 'reactflow';
import BaseNode from '@/layouts/BaseNode';
import { Box } from '@chakra-ui/react';
import { CustomHandle } from '@/layouts/CustomHandle';

const ColorOutputNode: FC<NodeProps> = (props) => {
  const [color, setColor] = useState<string | undefined>(undefined);
  const { getNode } = useReactFlow()
  const nodeId = useNodeId()
  const currentNode = getNode(nodeId as string)

  useEffect(() => {
    if (!nodeId) return
    const currentNode = getNode(nodeId)
    const symbolData: string[] = Object.values(currentNode?.data)
    setColor(symbolData[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data])

  return (
    <BaseNode {...props} title="Colour output / display">
      <Box bgColor={color || '#FFFFFF'} w="15rem" h="5rem" borderRadius="1rem" />
      <CustomHandle pos={Position.Left} type="target" />
    </BaseNode >
  );
};

export default ColorOutputNode;
