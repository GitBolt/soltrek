import React, { useState, useEffect, FC } from 'react';
import { Position, NodeProps, useNodes, useNodeId, useReactFlow } from 'reactflow';
import BaseNode from '@/layout/BaseNode';
import { Text } from '@chakra-ui/react';
import { CustomHandle } from '@/layout/CustomHandle';

const AddNode: FC<NodeProps> = (props) => {
  const [price, setPrice] = useState<number | undefined>(undefined);
  const { getNode } = useReactFlow()
  const nodeId = useNodeId()
  const nodes = useNodes()

  const currentNodeObj = nodes.find((node) => node.id == nodeId)

  useEffect(() => {
    if (!nodeId) return
    const currentNode = getNode(nodeId)
    const values = Object.values(currentNode?.data).map((item) => Number(item))
    if (values) {
      const res = values[0] + values[1]
      setPrice(res)
    }
    else {
      setPrice(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeObj?.data])

  return (
    <BaseNode {...props} title="Add two numbers">
      {price ?
        <Text fontSize="2rem" color="blue.500">{price.toLocaleString()}</Text> :
        <Text color="gray.100" fontSize="1.8rem">Empty...</Text>}
      <CustomHandle pos={Position.Left} type="target" style={{ marginTop: "-0.7rem" }} id="a"/>
      <CustomHandle pos={Position.Left} type="target" style={{ marginTop: "2.5rem" }} id="b"/>
    </BaseNode >
  );
};

export default AddNode;
