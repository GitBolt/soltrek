import React, { useState, useEffect, FC } from "react";
import {
  NodeProps,
  useNodes,
  useNodeId,
  useReactFlow,
  Connection,
} from "reactflow";
import BaseNode from "@/layout/BaseNode";
import { CustomHandle } from "@/layout/CustomHandle";
import { handleValue } from "@/util/helper";
import { sendSOL } from "@/util/sendToken";
import { TransactionInstruction } from "@solana/web3.js";


const SendSOL: FC<NodeProps> = (props) => {
  const { getNode, setNodes, getEdges } = useReactFlow();
  const nodeId = useNodeId();
  const [ix, setIx] = useState<TransactionInstruction | null | undefined>(null);
  const currentNode = getNode(nodeId as string)

  const updateNodeData = (nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            data,
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
    console.log("AAAAA", ix)
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
          setIx(ix);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);

  return (
    <BaseNode height="130px" {...props} title="Send SOL">
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
