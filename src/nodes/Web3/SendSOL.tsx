import React, { useState, useEffect, FC } from "react";
import {
  NodeProps,
  useNodes,
  useNodeId,
  useReactFlow,
  Connection,
} from "reactflow";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { handleValue } from "@/util/handleNodeValue";
import { sendSOL } from "@/util/sendToken";
import { TransactionInstruction } from "@solana/web3.js";

const SendSOL: FC<NodeProps> = (props) => {
  const { getNode, setNodes, getEdges } = useReactFlow();
  const id = useNodeId();
  const [ix, setIx] = useState<TransactionInstruction | null | undefined>(null);
  const currentNode = getNode(id as string);

  const updateNodeData = (nodeId: string, data: any) => {
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

  const handleConnect = (e: Connection, data: any) => {
    if (!e.target) return;
    updateNodeData(e.target, data);
  };

  useEffect(() => {
    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "sender",
      "receiver",
      "amount",
      "rpc",
    ]);

    if (currentNode && Object.values(values).length) {
      sendSOL(values["sender"], values["receiver"], values["amount"]).then(
        (ix) => {
          console.log("done", ix)
          setIx(ix);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);

  const cleanedCode = sendSOL.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const sendSOL = ${cleanedCode}`;


  return (
    <BaseNode height="130px" code={CODE} {...props} title="Send SOL">
      <CustomHandle
        pos="left"
        type="target"
        id="rpc"
        label="RPC URL"
        optional
        style={{ marginTop: "-3rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        label="Sender Address"
        id={"sender"}
        style={{ marginTop: "-0.7rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        label="Target Address"
        id="receiver"
        style={{ marginTop: "1.8rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id={"amount"}
        label="Amount"
        style={{ marginTop: "4.3rem" }}
      />

      <CustomHandle
        pos="right"
        type="source"
        onConnect={(e: any) => {
          handleConnect(e, ix);
        }}
        style={{ marginTop: "0.7rem" }}
        label="Instruction"
      />
    </BaseNode>
  );
};

export default SendSOL;
