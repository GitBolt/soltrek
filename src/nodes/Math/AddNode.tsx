import React, { useState, useEffect, FC } from 'react';
import { Position, NodeProps, useNodeId, useReactFlow } from 'reactflow';
import BaseNode from '@/layouts/BaseNode';
import { Text } from '@chakra-ui/react';
import { CustomHandle } from '@/layouts/CustomHandle';
import { handleValue } from '@/util/handleNodeValue';

const AddNode: FC<NodeProps> = (props) => {
  const [sum, setSum] = useState<number>(0);
  const { getNode, getEdges } = useReactFlow()
  const nodeId = useNodeId()

  const currentNode = getNode(nodeId as string)

  useEffect(() => {
    if (!nodeId) return
    const currentNode = getNode(nodeId)

    const edges = getEdges()

    const values = handleValue(currentNode, edges, [
      "number1",
      "number2",
    ]);
    if (values['number1'] && values['number2']) {
      const res = values['number1'] + values['number2']
      setSum(res)
    }
    else {
      setSum(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data])

  return (
    <BaseNode {...props} title="Add two numbers">
      {sum ?
        <Text fontSize="2rem" color="blue.500">{sum.toLocaleString()}</Text> :
        <Text color="blue.300" opacity="50%" fontSize="1.8rem">Empty...</Text>}
      <CustomHandle pos={Position.Left} type="target" label="Number 1" id="number1" style={{ marginTop: "-0.7rem" }} />
      <CustomHandle pos={Position.Left} type="target" label="Number 2" id="number2" style={{ marginTop: "2.5rem" }} />
    </BaseNode >
  );
};

export default AddNode;
