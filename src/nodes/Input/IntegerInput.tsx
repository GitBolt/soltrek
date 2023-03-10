import React, { FC, useEffect, useState } from 'react';
import BaseNode from '@/layout/BaseNode';
import { Position, NodeProps, Connection, useReactFlow, useNodeId } from 'reactflow';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { CustomHandle } from '@/layout/CustomHandle';

type InputNodeType = {
  placeholder: string;
};

const IntegerInputNode: FC<NodeProps<InputNodeType>> = (props) => {

  const [number, setnumber] = useState<number>(0)
  const [currentTarget, setCurrentTarget] = useState<string[]>([])
  const { setNodes } = useReactFlow()
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>();

  const id = useNodeId()

  const updateText = (number: number) => {
    if (timerId) clearTimeout(timerId);

    setTimerId(setTimeout(() => {
      setnumber(number);
      currentTarget.forEach((target) => updateNodeData(target))
    }, 200));
  };

  const updateNodeData = (nodeId: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            [id as string]: number,
          };
        }
        return node;
      }))
  }

  const CustomHandleConnect = (e: Connection) => {
    if (!e.target) return
    setCurrentTarget([...currentTarget, e.target])
    updateNodeData(e.target)
  };

  useEffect(() => {
    if (!currentTarget) return
    currentTarget.forEach((target) => updateNodeData(target))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number])


  return (
    <div>
      <BaseNode {...props} title="Integer Input">

        <NumberInput
          w="80%"
          id={props.id}
          onChange={(e) => updateText(Number(e))}
        >
          <NumberInputField
            placeholder={props.data.placeholder || "Enter numbers here..."}

            h="3rem"
            fontSize="1.2rem"
          />
          <NumberInputStepper>
            <NumberIncrementStepper color="white" />
            <NumberDecrementStepper color="white" />
          </NumberInputStepper>
        </NumberInput>

        <CustomHandle pos={Position.Right} type="source" onConnect={(e: any) => CustomHandleConnect(e)} />
      </BaseNode>
    </div>
  );
};

export default IntegerInputNode;
