import React from "react";
import { CopyBlock, dracula } from "react-code-blocks";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { CodeSPL } from "@/util/sendToken";
export const CodeBlock = ({ code }: { code: any }) => {
  return (
    <CopyBlock
      text={code}
      language={"typescript"}
      showLineNumbers={true}
      theme={dracula}
      codeBlock
    />
  );
};
interface Props {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}
export const CodeModel = ({ code, isOpen, onClose }: Props) => {
  return (
    <Modal size={"6xl"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={"#282A36"} fontSize={"1.4rem"} h={"max"}>
        <ModalHeader color={"white"}>Code</ModalHeader>
        <ModalCloseButton size={"xl"} mt={2} mr={2} color={"white"} />
        <ModalBody>
          <CodeBlock code={code} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
