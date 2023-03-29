import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { handleValue } from "@/util/handleNodeValue";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { createQR, encodeURL, TransferRequestURLFields } from "@solana/pay";
import { Keypair, PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  NodeProps,
  useNodeId,
  useReactFlow,
} from "reactflow";

const SolanaPay: FC<NodeProps> = (props) => {

  const qrRef = useRef<HTMLDivElement>(null);
  const reference = useMemo(() => Keypair.generate().publicKey, []);

  const { getNode, getEdges } = useReactFlow();
  const nodeId = useNodeId();
  const currentNode = getNode(nodeId as string);


  const SolPayCode = `
  const SolanaPay = ({ recipient, splToken, amount}: Props)=>{

    const qr = useRef()
    useEffect(()=>{
      if (!recipient || !splToken || !amount) return
      const urlParams: TransferRequestURLFields = {
        recipient: new PublicKey(recipient),
        splToken: new PublicKey(splToken),
        amount: BigNumber(amount),
        reference,
        label,
        message,
      }
  
      const url = encodeURL(urlParams)
      const qr = createQR(url, 200, '#1B192F', "white")
      if (qrRef.current && amount > 0) {
        qrRef.current.innerHTML = ''
        qr.append(qrRef.current)
      }
    },[])
    return (
      <>
        <div ref={qr} />
      </>
    )
  }
  `;

  useEffect(() => {
    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "spl_token",
      "recipient",
      "amount",
      "label",
      "message",
    ]);

    const recipient = values["recipient"]
    const splToken = values["spl_token"]
    const amount = values["amount"]
    const label = values["label"] || "SOL Trek";
    const message = values["message"] ||
      "Solana Pay QR generated using SOL Trek";

    if (!recipient || !splToken || !amount) return;
    const urlParams: TransferRequestURLFields = {
      recipient: new PublicKey(recipient),
      splToken: new PublicKey(splToken),
      amount: BigNumber(amount),
      reference,
      label,
      message,
    };

    const url = encodeURL(urlParams);
    const qr = createQR(url, 200, "#1B192F", "white");
    if (qrRef.current && amount > 0) {
      qrRef.current.innerHTML = "";
      qr.append(qrRef.current);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);
  return (
    <>
      <BaseNode code={SolPayCode} height="23rem" {...props} title="Solana Pay">
        <VStack>
          <CustomHandle
            pos="left"
            type="target"
            id="recipient"
            label="Recipient"
            style={{ marginTop: "-5.5rem" }}
          />
          <CustomHandle
            pos="left"
            type="target"
            id="spl_token"
            label="SPL Token"
            style={{ marginTop: "-2rem" }}
          />
          <CustomHandle
            pos="left"
            type="target"
            id="amount"
            label="Amount"
            style={{ marginTop: "1.5rem" }}
          />
          <CustomHandle
            pos="left"
            type="target"
            id="label"
            label="Label"
            style={{ marginTop: "5rem" }}
          />
          <CustomHandle
            pos="left"
            type="target"
            id="message"
            label="Message"
            style={{ marginTop: "8.5rem" }}
          />
        </VStack>
        <Flex
          align="center"
          justify="center"
          ml="6rem"
          mt="0.5rem"
          color="gray.100"
          borderRadius="2rem"
        >
          <Box sx={{ borderRadius: "2rem" }} ref={qrRef} />
        </Flex>
      </BaseNode>
    </>
  );
};

export default SolanaPay;
