import React, { FC, useEffect, useState } from 'react';
import BaseNode from '@/layouts/BaseNode';
import { Position, NodeProps, Connection, useReactFlow, useNodeId } from 'reactflow';
import { Box, Checkbox, Divider, Flex, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text } from '@chakra-ui/react';
import { CustomHandle } from '@/layouts/CustomHandle';
import { toBigNumber } from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';
import { CandyMachineTypes } from '@/types/protocols';

type InputNodeType = {
  placeholder: string;
};

const CandyMachineInput: FC<NodeProps<InputNodeType>> = (props) => {


  const { publicKey } = useWallet()
  const [config, setConfig] = useState<CandyMachineTypes.ConfigBuilder>({
    sellerFeeBasisPoints: 2.5,
    collectionMetadata: "",
    symbol: "TREK",
    collectionName: "SOL TREK",
    maxEditionSupply: toBigNumber(0),
    isMutable: true,
    itemsAvailable: toBigNumber(1),
    creators: [
      { address: publicKey?.toBase58() || '', share: 100 },
    ],
    itemSettings: {
      type: "configLines",
      prefixName: "TREK #",
      nameLength: 4,
      prefixUri: "https://ipfs.io/ipfs/",
      uriLength: 73,
      isSequential: false,
    }

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
      <BaseNode {...props} title="Candy Machine Configurations" height="75rem">

        <Flex flexFlow="column" gap="1.5rem" mt="1rem">

          <Box>
            <Text color="blue.100" fontSize="1.2rem">Collection Name</Text>
            <Input
              variant="node"
              value={config.collectionName}
              placeholder={props.data.placeholder || "Enter collection name"}
              id={props.id}
              onChange={(e) => setConfig({ ...config, collectionName: e.target.value })}
            />
          </Box>

          <Box>
            <Text color="blue.100" fontSize="1.2rem">Collection Metadata URI</Text>
            <Input
              variant="node"
              value={config.collectionMetadata}
              placeholder={props.data.placeholder || "Enter metadata uri"}
              id={props.id}
              onChange={(e) => setConfig({ ...config, collectionMetadata: e.target.value })}
            />
          </Box>

          <Divider />
          <Text color="gray.300" mt="-1rem" fontSize="1.2rem">Shared Settings</Text>

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
            <NumberInput
              precision={2}
              step={0.1}
              value={config.sellerFeeBasisPoints}
              id={props.id}
              onChange={(e) => setConfig({ ...config, sellerFeeBasisPoints: Number(e) })}
            >
              <NumberInputField
                placeholder="Enter royalty in percentage"
              />
              <NumberInputStepper>
                <NumberIncrementStepper color="white" />
                <NumberDecrementStepper color="white" />
              </NumberInputStepper>
            </NumberInput>
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
          >Is Mutable
          </Checkbox>
          <Divider />
          <Text color="gray.300" mt="-1rem" fontSize="1.2rem">Item Settings</Text>
          <Box>
            <Text color="blue.100" fontSize="1.2rem">Prefix Name</Text>

            <Input
              variant="node"
              value={config.itemSettings.prefixName}
              placeholder={props.data.placeholder || "Enter item prefix value"}
              id={props.id}
              onChange={(e) => setConfig({ ...config, itemSettings: { ...config.itemSettings, prefixName: e.target.value } })}

            />
          </Box>

          <Box>
            <Text color="blue.100" fontSize="1.2rem">Name Length</Text>

            <Input
              variant="node"
              value={config.itemSettings.nameLength}
              placeholder={props.data.placeholder || "Enter name length"}
              id={props.id}
              onChange={(e) => setConfig({ ...config, itemSettings: { ...config.itemSettings, nameLength: Number(e.target.value) } })}

            />
          </Box>

          <Box>
            <Text color="blue.100" fontSize="1.2rem">Prefix URI</Text>

            <Input
              variant="node"
              value={config.itemSettings.prefixUri}
              placeholder={props.data.placeholder || "Enter metadata prefix URI"}
              id={props.id}
              onChange={(e) => setConfig({ ...config, itemSettings: { ...config.itemSettings, prefixUri: e.target.value } })}

            />
          </Box>

          <Box>
            <Text color="blue.100" fontSize="1.2rem">URI Length</Text>

            <Input
              variant="node"
              value={config.itemSettings.uriLength}
              placeholder={props.data.placeholder || "Enter URI length"}
              id={props.id}
              onChange={(e) => setConfig({ ...config, itemSettings: { ...config.itemSettings, uriLength: Number(e.target.value) } })}

            />
          </Box>
        </Flex>
        <CustomHandle pos={Position.Right} type="source" onConnect={(e: any) => onConnect(e)} />
      </BaseNode>
    </div>
  );
};

export default CandyMachineInput;
