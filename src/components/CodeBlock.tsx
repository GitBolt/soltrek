import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { toast } from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

export const CodeModel = ({ code, isOpen, onClose }: Props) => {

  const { onCopy, hasCopied } = useClipboard(code)


  return (
    <Modal size={"6xl"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        bg={"#282A36"}
        fontSize={"1.5rem"}
        h={"max"}
        borderRadius={"0.5rem"}
      >
        <ModalHeader color={"white"}>
          <Flex justify="center" align="center" gap="2rem">
            <Text>TypeScript Code</Text>
            {hasCopied ? <CheckIcon color="lime" style={{ width: "1.5rem", height: "1.5rem" }} /> : <CopyIcon style={{ width: "1.5rem", height: "1.5rem", cursor: "pointer" }} onClick={onCopy} />}
          </Flex>
        </ModalHeader>
        <ModalCloseButton size={"xl"} mt={2} mr={2} color={"white"} />
        <SyntaxHighlighter
          showLineNumbers
          wrapLines
          language="typescript"
          style={dracula}>
          {code}
        </SyntaxHighlighter>
      </ModalContent>
    </Modal>
  );
};