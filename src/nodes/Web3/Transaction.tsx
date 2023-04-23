import React, { useState, useEffect, FC } from "react";
import {
  NodeProps,
  useNodeId,
  useReactFlow,
  Connection as RFCon,
} from "reactflow";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { handleValue } from "@/util/helper";
import {
  TransactionInstruction,
  Transaction,
  Connection,
  Keypair,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import base58 from "bs58";

const TransactionNode: FC<NodeProps> = (props) => {
  const { getNode, setNodes, getEdges } = useReactFlow();
  const nodeId = useNodeId();
  const currentNode = getNode(nodeId as string)

  const [txId, setTxId] = useState<
    TransactionInstruction | TransactionInstruction[] | null
  >([]);


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
    if (!values["signer"] || !values["instructions"] || !run) return;
    const tx = new Transaction();
    const connection = new Connection(
      values["rpc_url"] || "https://solana-devnet.g.alchemy.com/v2/uUAHkqkfrVERwRHXnj8PEixT8792zETN"
    );
    const kp = Keypair.fromSecretKey(base58.decode(values["signer"]));
    sendTx(connection, tx, kp).then((res) => console.log(res));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);

  return (
    <BaseNode code={CodeTx} height="160px" {...props} title="Transaction">
      <CustomHandle
        pos="left"
        type="target"
        id="rpc_url"
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
          handleConnect(e, txId);
        }}
        id="signature"
        style={{ marginTop: "0.5rem" }}
        label="Signature"
      />
    </BaseNode>
  );
};

export default TransactionNode;
