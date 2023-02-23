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
import { sendSPL } from "@/util/sendToken";
import { TransactionInstruction } from "@solana/web3.js";

const SendToken: FC<NodeProps> = (props) => {
  const { getNode, setNodes, getEdges } = useReactFlow();
  const nodeId = useNodeId();
  const nodes = useNodes();
  const [ix, setIx] = useState<
    TransactionInstruction | TransactionInstruction[] | null
  >([]);
  const currentNodeObj = nodes.find((node) => node.id == nodeId);

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
    if (!nodeId) return;
    const currentNode = getNode(nodeId);
    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "sender",
      "receiver",
      "amount",
      "rpc",
      "token",
    ]);
    if (currentNode && values) {
      sendSPL(
        values["tokens"],
        values["sender"],
        values["receiver"],
        values["amount"],
        values["rpc"]
      ).then((ix) => {
        setIx(ix);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeObj?.data]);

  return (
    <BaseNode height="160px" {...props} title="Send Tokens">
      <CustomHandle
        pos="left"
        type="target"
        id="rpc"
        label="RPC URL"
        optional
        style={{ marginTop: "-4.4rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="token"
        label="Token Address"
        style={{ marginTop: "-2rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        label="Sender Address"
        id={"sender"}
        style={{ marginTop: "0.4rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        label="Target Address"
        id={"receiver"}
        style={{ marginTop: "2.7rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id={"amount"}
        label="Amount"
        style={{ marginTop: "5rem" }}
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

export default SendToken;
