import React, { memo, FC, useState } from "react";
import { NodeProps } from "reactflow";
import { Text, Flex, Button, useDisclosure } from "@chakra-ui/react";
import { CodeModel } from "@/components/codeBlock";
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
              variant={"unstyled"}
              h={"max"}
            >
              <Text color="blue.100" fontWeight="600" fontSize="12px">
                export
              </Text>
            </Button>
          )}
        </Flex>
        <Flex
          h="auto"
          minH="80px"
          alignItems="center"
          overflowY="auto"
          width="100%"
          justifyContent="center"
          flexWrap="wrap"
        >
          {children}
        </Flex>
      </Flex>
    </>
  );
};

export default memo(BaseNode);
