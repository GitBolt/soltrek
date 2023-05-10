import React, { useState, useEffect, FC } from 'react';
import { NodeProps, useNodes, useNodeId, useReactFlow } from 'reactflow';
import BaseNode from '@/layouts/BaseNode';
import { Text } from '@chakra-ui/react';
import { CustomHandle } from '@/layouts/CustomHandle';
import { useNetworkContext } from '@/context/configContext';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

const GetSOLBalance: FC<NodeProps> = (props) => {
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string>('');
  const { getNode } = useReactFlow()
  const nodeId = useNodeId()
  const nodes = useNodes()

  const currentNodeObj = nodes.find((node) => node.id == nodeId)
  const { selectedNetwork } = useNetworkContext()

  useEffect(() => {
    if (!nodeId) return
    const currentNode = getNode(nodeId)
    const symbolData: string[] = Object.values(currentNode?.data)
    if (symbolData && symbolData.length) {

      const connection = new Connection(selectedNetwork)
      connection.getBalance(new PublicKey(symbolData[0]))
        .then((res) => setBalance(res / LAMPORTS_PER_SOL))

        .catch((error) => {
          console.error(error);
          setError(error.toString())
        });
    }
    else {
      setBalance(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeObj?.data])

  return (
    <BaseNode {...props} title="Get SOL Balance">
      {balance != undefined ?
          <Text fontSize="1.7rem" color="blue.500" whiteSpace="pre-wrap" my="2rem">{balance.toLocaleString()} SOL</Text>
        :
        <Text color="blue.300" opacity="50%" fontSize="1.5rem">{error || 'Empty...'}</Text>}

      <CustomHandle pos="left" type="target" label="Address" />
    </BaseNode >
  );

};

export default GetSOLBalance;
