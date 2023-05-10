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

const CandyMachineInput: FC<NodeProps<InputNodeType>> = (props) => {

  const { publicKey } = useWallet()
  const [config, setConfig] = useState({
    sellerFeeBasisPoints: 200,
    symbol: "TREK",
    maxEditionSupply: toBigNumber(0),
    isMutable: true,
    itemsAvailable: toBigNumber(1),
    creators: [
      { address: publicKey?.toBase58() || '', share: 100 },
    ],
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
      <BaseNode {...props} title="Candy Machine Configurations" height="35rem">

        <Flex flexFlow="column" gap="1.5rem" mt="3rem">
          <Box>
            <Text color="blue.100" fontSize="1.2rem">Symbol</Text>
            <Input
              variant="node"
              value={config.symbol}
              placeholder={props.data.placeholder || "Enter Symbol"}
              id={props.id}
              onChange={(e) => setConfig({ ...config, symbol: e.target.value })}
            />
          </Box>

          <Box>

            <Text color="blue.100" fontSize="1.2rem">Royalty Percentage</Text>
            <Input
              variant="node"
              value={config.sellerFeeBasisPoints}
              placeholder={props.data.placeholder || "Enter seller fee point basis"}
              id={props.id}
              onChange={(e) => setConfig({ ...config, sellerFeeBasisPoints: Number(e.target.value) })}

            />
          </Box>
          <Box>
            <Text color="blue.100" fontSize="1.2rem">Max Edition Supply</Text>
            <Input
              variant="node"
              value={config.maxEditionSupply.toNumber()}
              placeholder={props.data.placeholder || "Enter max edition supply"}
              id={props.id}
              onChange={(e) => setConfig({ ...config, maxEditionSupply: toBigNumber(Number(e.target.value)) })}

            />
          </Box>
          <Box>
            <Text color="blue.100" fontSize="1.2rem">Number of NFTs in collection</Text>

            <Input
              variant="node"
              value={config.itemsAvailable.toNumber()}
              placeholder={props.data.placeholder || "Enter item count"}
              id={props.id}
              onChange={(e) => setConfig({ ...config, itemsAvailable: toBigNumber(Number(e.target.value)) })}

            />
          </Box>
          <Checkbox defaultChecked
            onChange={(e) => setConfig({ ...config, isMutable: e.target.checked })}
            color="blue.100"
          >Is Mutable</Checkbox>
        </Flex>
        <CustomHandle pos={Position.Right} type="source" onConnect={(e: any) => onConnect(e)} />
      </BaseNode>
    </div>
  );
};

export default CandyMachineInput;
