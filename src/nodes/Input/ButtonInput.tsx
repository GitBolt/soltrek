import React, { FC, useEffect, useState } from 'react';
import BaseNode from '@/layout/BaseNode';
import { Handle, Position, NodeProps, Connection, useReactFlow, useNodeId } from 'reactflow';
import { Button } from '@chakra-ui/react';

type InputNodeType = {
  placeholder: string;
};

const ButtonInputNode: FC<NodeProps<InputNodeType>> = (props) => {

  const [string, setString] = useState<string>('')
  const [currentTarget, setCurrentTarget] = useState<string[]>([])
  const { setNodes } = useReactFlow()
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>();

  const id = useNodeId()

  const updateText = (text: string) => {
    if (timerId) clearTimeout(timerId);

    setTimerId(setTimeout(() => {
      setString(text);
      currentTarget.forEach((target) => updateNodeData(target))
    }, 200));
  };

  const updateNodeData = (nodeId: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            [id || '']: string,
          };
        }
        return node;
      }))
  }

  const handleConnect = (e: Connection) => {
    if (!e.target) return
    setCurrentTarget([...currentTarget, e.target])
    updateNodeData(e.target)
  };

  useEffect(() => {
    if (!currentTarget) return
    currentTarget.forEach((target) => updateNodeData(target))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [string])


  return (
    <div>
      <BaseNode {...props} title="Clicky clicky Button">
        <Button
          fontSize="1.2rem"
          h="3rem"
          w="15rem"
          variant="filled"
          id={props.id}
          onClick={(e) => updateText('')}>Run</Button>

        <Handle position={Position.Right} type="source" onConnect={(e) => handleConnect(e)} />
      </BaseNode>
    </div>
  );
};

export default ButtonInputNode;
