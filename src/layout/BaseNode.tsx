import React, { memo, FC, useState } from "react";
import { NodeProps } from "reactflow";
import { Text, Flex, Button, useDisclosure, Box } from "@chakra-ui/react";
import { CodeModel } from "@/components/CodeBlock";


const BaseNode: FC<
  NodeProps & {
    children?: React.ReactNode;
    title: string;
    height?: string | undefined;
    code?: string | undefined;
    width?: string | undefined;
  }
> = ({ children, title, selected, height, width, code }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [CodeState, setCodeState] = useState<string>("");
  return (
    <>
      {isOpen && (
        <CodeModel isOpen={isOpen} onClose={onClose} code={CodeState} />
      )}
      <Flex
        backgroundColor="bg.400"
        minW={width ? width : "220px"}
        h="auto"
        minH={height ? height : "100px"}
        overflow="auto"
        flexDirection="column"
        alignItems="center"
        border="1px solid"
        borderColor={selected ? "magenta.300" : "gray.200"}
        borderRadius="10px"
        boxShadow={selected ? "0px 0px 15px #732562" : ""}
      >
        <Flex
          backgroundColor="gray.100"
          align="center"
          justify={!code ? "center" : "space-between"}
          px={4}
          height="20px"
          width="100%"
          borderRadius="10px 10px 0 0"
        >
          <Text color="blue.100" fontWeight="600" fontSize="12px">
            {title}
          </Text>
          {code && (
            <Button
              onClick={() => {
                onOpen();
                setCodeState(code);
              }}
              fontSize="1.2rem"
              variant="outline"
              border="none"
              color="magenta.100"
              fontWeight={600}
              borderRadius="0.5rem"
              h="full"
              boxShadow="none"
            >
              View Code
            </Button>
          )}
        </Flex>
        <Box
          minH="80px"
          display="grid"
          placeItems="center"
        >
          {children}
        </Box>
      </Flex>
    </>
  );
};

export default memo(BaseNode);
