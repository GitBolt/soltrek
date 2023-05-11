import React, { FC, useEffect, useState } from 'react';
import BaseNode from '@/layouts/BaseNode';
import { Position, NodeProps, Connection, useReactFlow, useNodeId } from 'reactflow';
import { Input } from '@chakra-ui/react';
import { CustomHandle } from '@/layouts/CustomHandle';


const StringInputNode: FC<NodeProps> = (props) => {

  const [string, setString] = useState<string>('')
  const [targetNodes, setTargetNodes] = useState<string[]>([])
  const { setNodes } = useReactFlow()

  const id = useNodeId()

  // Update target nodes (accepting input) data with 100ms delay (required to work properly)
  const updateNodeData = (nodeIds: string[]) => {
    setTimeout(() => {
      setNodes(nodes => nodes.map(node =>
        nodeIds.includes(node.id)
          ? { ...node, data: { ...node.data, [id as string]: string } }
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
  }, [string])


  return (
    <div>
      <BaseNode {...props} title="String Input">
        <Input
          variant="node"
          placeholder="Enter some text here..."
          id={props.id}
          onChange={(e) => setString(e.target.value)}
        />

        <CustomHandle pos={Position.Right} type="source" onConnect={(e: any) => onConnect(e)} />
      </BaseNode>
    </div>
  );
};

export default StringInputNode;
