import React, { useState, useEffect, FC } from "react";
import {
  NodeProps,
  useNodes,
  useNodeId,
  useReactFlow,
  Connection as RFCon,
} from "reactflow";
import BaseNode from "@/layout/BaseNode";
import { CustomHandle } from "@/layout/CustomHandle";
import { handleValue } from "@/util/helper";
import { sendSPL } from "@/util/sendToken";
import {
  TransactionInstruction,
  Transaction,
  Connection,
  Keypair,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

const TransactionNode: FC<NodeProps> = (props) => {
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

  const handleConnect = (e: RFCon, data: any) => {
    if (!e.target) return;
    updateNodeData(e.target, data);
  };
  const CodeTx = `
  const sendTx = async (connection: Connection, tx: Transaction, kp: Keypair) => {
  const res = await sendAndConfirmTransaction(connection, tx, [kp])
  return res
}
`;
  const sendTx = async (
    connection: Connection,
    tx: Transaction,
    kp: Keypair
  ) => {
    const res = await sendAndConfirmTransaction(connection, tx, [kp]);
    return res;
  };
  useEffect(() => {
    if (!nodeId) return;
    const currentNode = getNode(nodeId);
    const dataKeys = Object.keys(currentNode?.data || {});
    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "rpc_url",
      "signer",
      "instructions",
    ]);

    const run = dataKeys.find(
      (key) => key.startsWith("btn") && currentNode?.data[key] == true
    );

    console.log(values["instructions"], "s");
    if (!values["signer"] || !values["instructions"] || !run) return;
    const tx = new Transaction();
    const connection = new Connection(
      values["rpc_url"] || "https://solana-devnet.g.alchemy.com/v2/uUAHkqkfrVERwRHXnj8PEixT8792zETN"
    );
    const kp = Keypair.fromSecretKey(values["signer"]);
    sendTx(connection, tx, kp).then((res) => console.log(res));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeObj?.data]);

  return (
    <BaseNode code={CodeTx} height="160px" {...props} title="Transaction">
      <CustomHandle
        pos="left"
        type="target"
        id="rpc"
        label="RPC URL"
        optional
        style={{ marginTop: "-4rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="send"
        label="Send"
        style={{ marginTop: "-1rem" }}
      />

      <CustomHandle
        pos="left"
        type="target"
        label="Instructions"
        id="instructions"
        style={{ marginTop: "2.2rem" }}
      />

      <CustomHandle
        pos="left"
        type="target"
        label="Private Key (Signer)"
        id="signer"
        style={{ marginTop: "5.5rem" }}
      />

      <CustomHandle
        pos="right"
        type="source"
        onConnect={(e: any) => {
          handleConnect(e, ix);
        }}
        id="signauture"
        style={{ marginTop: "0.5rem" }}
        label="Signature"
      />
    </BaseNode>
  );
};

export default TransactionNode;
