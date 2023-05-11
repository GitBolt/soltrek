import React, { FC, useEffect, useState } from 'react';
import BaseNode from '@/layouts/BaseNode';
import { Position, NodeProps, Connection, useReactFlow, useNodeId } from 'reactflow';
import { Button } from '@chakra-ui/react';
import { CustomHandle } from '@/layouts/CustomHandle';

const ButtonInputNode: FC<NodeProps> = (props) => {

  const [targetNodes, setTargetNodes] = useState<string[]>([])
  const { setNodes, setEdges } = useReactFlow()

  const id = useNodeId()

  const updateNodeData = (nodeIds: string[]) => {
    setTimeout(() => {
      setEdges(edgs => edgs.map(ed => ed.source === id ? { ...ed, animated: true } : ed));
      setNodes(nodes => nodes.map(node =>
        nodeIds.includes(node.id) ? { ...node, data: { ...node.data, [`btn${id}`]: true } } : node
      ));

      setTimeout(() => {
        setNodes(nodes => nodes.map(node =>
          nodeIds.includes(node.id) ? { ...node, data: { ...node.data, [`btn${id}`]: false } } : node
        ));
        setEdges(edgs => edgs.map(ed => ed.source === id ? { ...ed, animated: false } : ed));
      }, 500);

    }, 100);
  };


  const onConnect = (e: Connection) => {
    if (!e.target) return
    setTargetNodes([...targetNodes, e.target])

    // We don't want to trigger button action as soon as it connects to any input node
    // updateNodeData([e.target])
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
            updateNodeData(targetNodes)
          }}
        >Run</Button>

        <CustomHandle pos={Position.Right} type="source" onConnect={onConnect} />
      </BaseNode>
    </div>
  );
};

export default ButtonInputNode;
