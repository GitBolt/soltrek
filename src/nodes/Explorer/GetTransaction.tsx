import React, { useState, useEffect, FC } from 'react';
import { NodeProps, useNodeId, useReactFlow } from 'reactflow';
import BaseNode from '@/layout/BaseNode';
import { Box, Text, useClipboard } from '@chakra-ui/react';
import { CustomHandle } from '@/layout/CustomHandle';
import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { handleValue } from '@/util/helper';

const GetTransactionNode: FC<NodeProps> = (props) => {
  const [txDetails, setTxDetails] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string>('');
  const { getNode, getEdges } = useReactFlow()
  const nodeId = useNodeId()

  const { hasCopied, setValue, onCopy } = useClipboard(txDetails || '')
  const currentNode = getNode(nodeId as string)


  useEffect(() => {
    const edges = getEdges()
    const values = handleValue(currentNode, edges, ["txId"])
    if (!values["txId"]) return
    fetch(`https://api.solana.fm/v0/transactions/${values['txId']}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data) {
          setTxDetails(undefined)
          console.log("error")
          setError("Token not supported")
        } else {
          setTxDetails(JSON.stringify(data, null, 2));
          setValue(JSON.stringify(data, null, 2));
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data])

  return (
    <BaseNode {...props} title="Fetch Transaction Details">
      {txDetails ?
        <>
          <Text fontSize="1rem" color="blue.500" whiteSpace="pre-wrap" ml="4rem" my="2rem">{txDetails.toLocaleString()}</Text>
          <Box pos="absolute" top="3rem" right="1rem">
            {hasCopied ? <CheckIcon color="blue.200" w="1.5rem" h="1.5rem" /> :
              <CopyIcon onClick={onCopy} color="blue.200" w="1.5rem" h="1.5rem" />}
          </Box>
        </>
        :
        <Text color="blue.300" opacity="50%" fontSize="1.5rem">{error || 'Empty...'}</Text>}

      <CustomHandle pos="left" type="target" label="Tx Id" id="txId" />
    </BaseNode >
  );

};

export default GetTransactionNode;
