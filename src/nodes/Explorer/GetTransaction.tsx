import React, { useState, useEffect, FC } from 'react';
import { NodeProps, useNodeId, useReactFlow } from 'reactflow';
import BaseNode from '@/layouts/BaseNode';
import { Box, Text, useClipboard } from '@chakra-ui/react';
import { CustomHandle } from '@/layouts/CustomHandle';
import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { handleValue } from '@/util/handleNodeValue';
import { Connection, TransactionResponse } from '@solana/web3.js';
import { useNetworkContext } from '@/context/configContext';
import { stringify } from '@/util/helper';

const GetTransactionNode: FC<NodeProps> = (props) => {
  const [txDetails, setTxDetails] = useState<any | undefined>(undefined);
  const [error, setError] = useState<string>('');
  const { getNode, getEdges } = useReactFlow()
  const nodeId = useNodeId()

  const { hasCopied, setValue, onCopy } = useClipboard(txDetails || '')
  const currentNode = getNode(nodeId as string)

  const { selectedNetwork } = useNetworkContext()
  useEffect(() => {
    const edges = getEdges()
    const values = handleValue(currentNode, edges, ["txId"])
    if (!values["txId"]) return

    const connection = new Connection(selectedNetwork)

    connection.getParsedTransaction(values["txId"])
      .then((res) => {
        if (!res) return
        setTxDetails(stringify(res))
      })
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
