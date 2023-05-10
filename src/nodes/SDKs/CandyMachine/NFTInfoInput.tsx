import React, { FC, useEffect, useState } from 'react';
import BaseNode from '@/layouts/BaseNode';
import { Position, NodeProps, Connection, useReactFlow, useNodeId } from 'reactflow';
import { Box, Checkbox, Flex, Input, Text } from '@chakra-ui/react';
import { CustomHandle } from '@/layouts/CustomHandle';
import { toBigNumber } from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';

type InputNodeType = {
  placeholder: string;
};

const NFTInfoInput: FC<NodeProps<InputNodeType>> = (props) => {

  const [config, setConfig] = useState({
    name: "SOL TREK",
    uri: "",
  })

  const [targetNodeIds, setTargetNodeIds] = useState<string[]>([])
  const { setNodes } = useReactFlow()

  const id = useNodeId()

  const updateNodeData = (nodeId: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            [id as string]: config,
          };
        }
        return node;
      }))
  }

  const onConnect = (e: Connection) => {
    if (!e.target) return
    setTargetNodeIds([...targetNodeIds, e.target])
    updateNodeData(e.target)
  };


  // Updating input nodes with latest output data from this node
  useEffect(() => {
    if (!targetNodeIds) return
    targetNodeIds.forEach((target) => updateNodeData(target))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config])


  return (
    <div>
      <BaseNode {...props} title="Candy Machine Configurations" height="20rem">

        <Flex flexFlow="column" gap="1.5rem" mt="3rem">
          <Box>
            <Text color="blue.100" fontSize="1.2rem">Name</Text>
            <Input
              variant="node"
              value={config.name}
              placeholder={props.data.placeholder || "Enter name"}
              id={props.id}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
            />
          </Box>

          <Box>

            <Text color="blue.100" fontSize="1.2rem">Metadata URI</Text>
            <Input
              variant="node"
              value={config.uri}
              placeholder={props.data.placeholder || "Enter URI"}
              id={props.id}
              onChange={(e) => setConfig({ ...config, uri: e.target.value })}
            />
          </Box>
        </Flex>
        <CustomHandle pos={Position.Right} type="source" onConnect={(e: any) => onConnect(e)} />
      </BaseNode>
    </div>
  );
};

export default NFTInfoInput;
