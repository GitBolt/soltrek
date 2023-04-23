import React, { useState, useEffect, FC } from 'react';
import { Position, NodeProps, useNodeId, useReactFlow } from 'reactflow';
import BaseNode from '@/layouts/BaseNode';
import { Text, useClipboard, Box } from '@chakra-ui/react';
import { CustomHandle } from '@/layouts/CustomHandle';
import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { stringify } from '@/util/helper';

const TextOutputNode: FC<NodeProps> = (props) => {
  const [text, setText] = useState<string | undefined>(undefined);
  const { getNode } = useReactFlow()
  const { onCopy, setValue, hasCopied } = useClipboard(text || '');

  const nodeId = useNodeId()
  const currentNode = getNode(nodeId as string)

  useEffect(() => {
    const dataValues: string[] = Object.values(currentNode?.data)
    let data: string | null = dataValues[0]
    if (data) {
      data = stringify(data)
    }
    setText(data ? data.replace(/^"|"$/g, '') : '')
    setValue(data? data.replace(/^"|"$/g, '') : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data])

  return (
    <BaseNode {...props} title="Text output">
      {text ?
        <>
          <Text fontSize="1.5rem" color="blue.500" mx="2rem" whiteSpace="pre-wrap" my="2rem">{text}</Text>
          <Box pos="absolute" top="3rem" right="1rem">
            {hasCopied ? <CheckIcon color="blue.200" w="1.5rem" h="1.5rem" /> :
              <CopyIcon onClick={onCopy} color="blue.200" w="1.5rem" h="1.5rem" />}
          </Box>
        </>
        :
        <Text color="blue.300" opacity="50%" fontSize="1.8rem">Empty...</Text>}
      <CustomHandle pos={Position.Left} type="target" />
    </BaseNode >
  );
};

export default TextOutputNode;


