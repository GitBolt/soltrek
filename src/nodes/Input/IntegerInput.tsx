import React, { FC, useEffect, useState } from 'react';
import BaseNode from '@/layouts/BaseNode';
import { Position, NodeProps, Connection, useReactFlow, useNodeId } from 'reactflow';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { CustomHandle } from '@/layouts/CustomHandle';



const IntegerInputNode: FC<NodeProps> = (props) => {

  const [number, setNumber] = useState<number>(0)
  const [targetNodes, setTargetNodes] = useState<string[]>([])
  const { setNodes } = useReactFlow()

  const id = useNodeId()

  // Update target nodes (accepting input) data with 100ms delay (required to work properly)
  const updateNodeData = (nodeIds: string[]) => {
    setTimeout(() => {
      setNodes(nodes => nodes.map(node =>
        nodeIds.includes(node.id)
          ? { ...node, data: { ...node.data, [id as string]: number } }
          : node
      ));
    }, 100);
  };

  // Updating a new input node with data from this node as soon as it's connected
  const onConnect = (e: Connection) => {
    if (!e.target) return
    setTargetNodes([...targetNodes, e.target])
    updateNodeData([e.target])
  };

  // Pushing new data to all input nodes connected
  useEffect(() => {
    if (!targetNodes) return
    updateNodeData(targetNodes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number])



  return (
    <div>
      <BaseNode {...props} title="Integer Input">

        <NumberInput
          w="80%"
          id={props.id}
          onChange={(e) => setNumber(Number(e))}
        >
          <NumberInputField
            placeholder="Enter some numbers..."

            h="3rem"
            fontSize="1.2rem"
          />
          <NumberInputStepper>
            <NumberIncrementStepper color="white" />
            <NumberDecrementStepper color="white" />
          </NumberInputStepper>
        </NumberInput>

        <CustomHandle pos={Position.Right} type="source" onConnect={onConnect} />
      </BaseNode>
    </div>
  );
};

export default IntegerInputNode;
