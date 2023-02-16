import React, { FC, useEffect, useState } from 'react';
import BaseNode from '@/layout/BaseNode';
import { Handle, Position, NodeProps, Connection, useReactFlow, useNodeId } from 'reactflow';
import { Button } from '@chakra-ui/react';

type InputNodeType = {
  placeholder: string;
};

const ButtonInputNode: FC<NodeProps<InputNodeType>> = (props) => {

  const [currentTarget, setCurrentTarget] = useState<string[]>([])
  const { setNodes, setEdges } = useReactFlow()

  const id = useNodeId()

  const updateNodeData = (nodeId: string) => {

    setEdges((edgs) =>
      edgs.map((ed) => {
        if (ed.source == id) {
          ed.animated = true
          return ed
        }
        return ed;
      }))
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            ['btn' + id || '']: true,
          };
        }
        return node;
      }))

    setTimeout(() => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            node.data = {
              ...node.data,
              ['btn' + id || '']: false,
            };
          }
          return node;
        }))

      setEdges((edgs) =>
        edgs.map((ed) => {
          if (ed.source == id) {
            ed.animated = false
            return ed
          }
          return ed;
        }))
    }, 500)
  }

  const handleConnect = (e: Connection) => {
    if (!e.target) return
    setCurrentTarget([...currentTarget, e.target])
    updateNodeData(e.target)
  };



  return (
    <div>
      <BaseNode {...props} title="Clicky clicky Button">
        <Button
          fontSize="1.2rem"
          h="3rem"
          w="15rem"
          variant="filled"
          id={props.id}
          onClick={(e) => {
            if (!currentTarget) return
            currentTarget.forEach((target) => updateNodeData(target))
          }}
        >Run</Button>

        <Handle position={Position.Right} type="source" onConnect={(e) => handleConnect(e)} />
      </BaseNode>
    </div>
  );
};

export default ButtonInputNode;
