import React, { useState, useEffect, FC } from "react";
import {
  NodeProps,
  useNodeId,
  useReactFlow,
  Connection as RFCon,
} from "reactflow";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { handleValue } from "@/util/handleNodeValue";
import {
  TransactionInstruction,
  Transaction,
  Connection,
  Keypair,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import base58 from "bs58";
import { Text } from "@chakra-ui/react";

const TransactionNode: FC<NodeProps> = (props) => {
  const { getNode, setNodes, getEdges } = useReactFlow();
  const nodeId = useNodeId();
  const currentNode = getNode(nodeId as string)

  const [txId, setTxId] = useState<string>('');
  const [error, setError] = useState<string>('');


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



  useEffect(() => {
    const dataKeys = Object.keys(currentNode?.data || {});
    const edges = getEdges();

    const values = handleValue(currentNode, edges, [
      "rpc_url",
      "signer",
    ]);

    const run = dataKeys.find(
      (key) => key.startsWith("btn") && currentNode?.data[key] == true
    );
    if (!values["signer"] || !run) return;

    const runThis = async () => {
      const connection = new Connection(
        values["rpc_url"] || process.env.NEXT_PUBLIC_DEFAULT_RPC as string
      );
      const tx = new Transaction()

      const ixValues = Object.values(currentNode!.data).filter((item) => {
        // array of ix
        if (Array.isArray(item) && item.length > 1) {
          return item
        }
        // one ix
        if (typeof (item) == 'object' && Object.keys(item as Object).includes("keys")) {
          return item
        }
      })
      const privKey: string = values["signer"]
      let parsed: any
      try {
        parsed = new Uint8Array(base58.decode(privKey))
      } catch {
        try {
          parsed = new Uint8Array(JSON.parse(privKey))
        } catch (e) {
          console.log("Keypair Error: ", e)
        }
      }
      console.log(tx)
      const kp = Keypair.fromSecretKey(parsed)


      const ix = ixValues.flat() as TransactionInstruction[]
      const { blockhash } = await connection.getLatestBlockhash()
      tx.recentBlockhash = blockhash
      tx.feePayer = kp.publicKey
      ix.forEach((i: TransactionInstruction) => tx.add(i))

      try {
        const res = await sendAndConfirmTransaction(connection, tx, [kp])
        setTxId(res)
      } catch (e: any) {
        setError(e?.message || e.toString())
      }
    }

    runThis()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);

  const CodeTx = `
  const sendTx = async (connection: Connection, tx: Transaction, kp: Keypair) => {
  const res = await sendAndConfirmTransaction(connection, tx, [kp])
  return res
  }
`;
  return (
    <BaseNode code={CodeTx} height="160px" {...props} title="Transaction">

      {error ?
        <Text
          fontSize="1.2rem"
          bg="#C5303080"
          borderRadius="1rem"
          p="0.5rem 1rem"
          textAlign="center"
          transform="translate(0rem, 3rem)"
          zIndex="3"
          maxW="50%"
          mx="3rem"
          color="white"
          fontWeight={600}>
          {error.toLocaleString()}
        </Text> :
        null}

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
        id="run"
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
