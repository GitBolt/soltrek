import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { createPDA } from "@/util/generatePDA";
import { handleValue } from "@/util/handleNodeValue";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Text } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import base58 from "bs58";
import React, { FC, useEffect, useState } from "react";
import {
  Connection,
  NodeProps,
  useNodeId,
  useReactFlow,
} from "reactflow";
import * as nacl from 'tweetnacl';

const VerifyMessage: FC<NodeProps> = (props) => {
  const [res, setRes] = useState<boolean | null>(null);
  const [outputNodes, setOutputNodes] = useState<string[]>([]);

  const { getNode, setNodes, getEdges } = useReactFlow();
  const id = useNodeId();

  const currentNode = getNode(id as string)

  const updateNodeData = (nodeId: string, data: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            [id as string]: data,
          };
        }
        return node;
      })
    );
  };

  const updateOutputs = (e: Connection) => {
    if (!e.target) return;
    updateNodeData(e.target, String(res) as string);
    setOutputNodes([...outputNodes, e.target]);
  };


  useEffect(() => {
    outputNodes.forEach((target) =>
      updateNodeData(target, String(res) as string)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [res]);


  useEffect(() => {

    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "message",
      "sig",
      "pubKey"
    ])

    const message = values["message"]
    const sig = values["sig"]
    const pubKey = values["pubKey"]
    if (!message || !sig || !pubKey) return

    const result = nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      new Uint8Array(base58.decode(sig)),
      new PublicKey(pubKey).toBytes()
    )
    setRes(result)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);

  const CODE = `export const verifyMessage = (message: string, signature: string, pubKey: string) => {
    const result = nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      new Uint8Array(base58.decode(sig)),
      new PublicKey(pubKey).toBytes()
    )
    return result
    )
  }`;

  return (
    <>
      <BaseNode {...props} title="Verify Message" height="12rem" code={CODE}>
        {res ? <CheckIcon style={{width:"3rem", height:"3rem"}} color="lime"/> : <CloseIcon style={{width:"3rem", height:"3rem"}} color="red"/>}

        <CustomHandle
          pos="left"
          type="target"
          id="message"
          label="Message"
          style={{ marginTop: "-2rem" }}
        />
        <CustomHandle
          pos="left"
          type="target"
          id="sig"
          label="Signature"
          style={{ marginTop: "1rem" }}
        />
        <CustomHandle
          pos="left"
          type="target"
          id="pubKey"
          label="Public Key"
          style={{ marginTop: "3.8rem" }}
        />
      </BaseNode>
    </>
  );
};

export default VerifyMessage;
