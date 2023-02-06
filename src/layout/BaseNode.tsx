import React, { memo, FC } from 'react';
import { NodeProps } from 'reactflow';
import { Text, Flex } from '@chakra-ui/react';

const BaseNode: FC<NodeProps & { children?: React.ReactNode, title: string }> = ({ children, title, selected }) => {

  return (
    <Flex
      backgroundColor="bg.400"
      width="220px"
      height="100px"
      flexDirection="column"
      alignItems="center"
      border="1px solid"
      borderColor={selected ? "magenta.300" : 'gray.200'}
      borderRadius="10px"
      boxShadow={selected ? '0px 0px 15px #732562' : ''}
    >
      <Flex
        backgroundColor="gray.100"
        align="center"
        justify="center"
        height="20px"
        width="100%"
        borderRadius="10px 10px 0 0"
      >
        <Text color="blue.100" fontWeight="600" fontSize="12px">
          {title}
        </Text>
      </Flex>
      <Flex
        height="calc(100% - 20px)"
        alignItems="center"
        overflowY="auto"
        w="100%"
        justifyContent="center"
      >
        {children}
      </Flex>
    </Flex>
  );
};

export default memo(BaseNode);
