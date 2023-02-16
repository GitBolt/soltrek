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
    setEdges((edges) => {
      return edges.map((edge) => {
        if (edge.source === id) {
          return { ...edge, animated: true };
        }
        return edge;
      });
    });
    setNodes((nodes) => {
      return nodes.map((node) => {
        if (node.id === nodeId) {
          const newData = { ...node.data, [`btn${id}`]: true };
          return { ...node, data: newData };
        }
        return node;
      });
    });
  
    setTimeout(() => {
      setNodes((nodes) => {
        return nodes.map((node) => {
          if (node.id === nodeId) {
            const newData = { ...node.data, [`btn${id}`]: false };
            return { ...node, data: newData };
          }
          return node;
        });
      });
  
      setEdges((edges) => {
        return edges.map((edge) => {
          if (edge.source === id) {
            return { ...edge, animated: false };
          }
          return edge;
        });
      });
    }, 500);
  };
  

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
