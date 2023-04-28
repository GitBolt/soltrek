import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { createPDA } from "@/util/generatePDA";
import { handleValue } from "@/util/handleNodeValue";
import base58 from "bs58";
import React, { FC, useEffect, useState } from "react";
import {
  Connection,
  NodeProps,
  useNodeId,
  useReactFlow,
} from "reactflow";
import * as nacl from 'tweetnacl';

const SignMessage: FC<NodeProps> = (props) => {
  const [signature, setSignature] = useState<string | undefined>("");
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
    updateNodeData(e.target, signature as string);
    setOutputNodes([...outputNodes, e.target]);
  };


  useEffect(() => {
    outputNodes.forEach((target) =>
      updateNodeData(target, signature as string)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);


  useEffect(() => {

    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "priv_key",
      "message",
    ])

    const priv_key = values["priv_key"]
    const message = values["message"]
    if (!priv_key || !message) return

    let pkArray: any = base58.decode(priv_key)
    try {
      pkArray = new Uint8Array(pkArray)
    } catch {
      try {
        pkArray = new Uint8Array(pkArray)
      } catch (e) {
        console.log("Sign Message Error: ", e)
      }
    }
    const sig = nacl.sign.detached(new TextEncoder().encode(message), pkArray)
    setSignature(base58.encode(sig))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);

  const CODE = `export const signMessage = (message: string, private_key: Uint8Array) => {
    const encodedMessage = new TextEncoder().encode(message)
    nacl.sign.detached(encodedMessage, private_key)
  }`;

  return (
    <>
      <BaseNode {...props} title="Sign Message" code={CODE}>
        <CustomHandle
          pos="left"
          type="target"
          id="priv_key"
          label="Private Key"
          style={{ marginTop: "-1rem" }}
        />
        <CustomHandle
          pos="left"
          type="target"
          id="message"
          label="Message"
          style={{ marginTop: "2rem" }}
        />
        <CustomHandle
          pos="right"
          type="source"
          id="signature"
          label="Signature"
          onConnect={(e: any) => {
            updateOutputs(e);
          }}
        />
      </BaseNode>
    </>
  );
};

export default SignMessage;
