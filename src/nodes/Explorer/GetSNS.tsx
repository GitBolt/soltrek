import React, { useState, useEffect, FC } from 'react';
import { Handle, Position, NodeProps, useNodes, useNodeId, useReactFlow } from 'reactflow';
import BaseNode from '@/layouts/BaseNode';
import { Box, Text, useClipboard } from '@chakra-ui/react';
import { CustomHandle } from '@/layouts/CustomHandle';
import { CheckIcon, CopyIcon } from '@chakra-ui/icons';

const GetSNS: FC<NodeProps> = (props) => {
  const [tokenDetails, setTokenDetails] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string>('');
  const { getNode } = useReactFlow()
  const nodeId = useNodeId()
  const nodes = useNodes()

  const { hasCopied, setValue, onCopy } = useClipboard(tokenDetails || '')
  const currentNodeObj = nodes.find((node) => node.id == nodeId)


  useEffect(() => {
    if (!nodeId) return
    const currentNode = getNode(nodeId)
    const symbolData: string[] = Object.values(currentNode?.data)
    if (symbolData && symbolData.length) {
      fetch(`https://api.solana.fm/v0/domains/bonfida/${symbolData.join(',')}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data) {
            setTokenDetails(undefined)
            setError("Error with domain")
          } else {
            setTokenDetails(JSON.stringify(data.result, null, 2));
            setValue(JSON.stringify(data.result, null, 2));
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {
      setTokenDetails(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeObj?.data])

  return (
    <BaseNode {...props} title="Fetch SNS Domains">
      {tokenDetails ?
        <>
          <Text fontSize="1rem" color="blue.500" whiteSpace="pre-wrap" ml="4rem" my="2rem">{tokenDetails.toLocaleString()}</Text>
          <Box pos="absolute" top="3rem" right="1rem">
            {hasCopied ? <CheckIcon color="blue.200" w="1.5rem" h="1.5rem" /> :
              <CopyIcon onClick={onCopy} color="blue.200" w="1.5rem" h="1.5rem" />}
          </Box>
        </>
        :
        <Text color="blue.300" opacity="50%" fontSize="1.5rem">{error || 'Empty...'}</Text>}

      <CustomHandle pos="left" type="target" label="Address" />
    </BaseNode >
  );

};

export default GetSNS;
