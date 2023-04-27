import React, { FC, useEffect, useState } from 'react';
import BaseNode from '@/layouts/BaseNode';
import { Position, NodeProps, Connection, useReactFlow, useNodeId } from 'reactflow';
import { Input } from '@chakra-ui/react';
import { CustomHandle } from '@/layouts/CustomHandle';

type InputNodeType = {
  placeholder: string;
};

const StringInputNode: FC<NodeProps<InputNodeType>> = (props) => {

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
            [id as string]: string,
          };
        }
        return node;
      }))
  }

  const onConnect = (e: Connection) => {
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
      <BaseNode {...props} title="String Input">
        <Input
          variant="node"
          placeholder={props.data.placeholder || "Enter some text here..."}
          id={props.id}
          onChange={(e) => updateText(e.target.value)}
           />

        <CustomHandle pos={Position.Right} type="source" onConnect={(e: any) => onConnect(e)} />
      </BaseNode>
    </div>
  );
};

export default StringInputNode;
