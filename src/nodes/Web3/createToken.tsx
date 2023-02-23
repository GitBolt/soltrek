import React, { useState, useEffect, FC } from "react";
import {
  Position,
  NodeProps,
  useNodes,
  useNodeId,
  useReactFlow,
  Connection,
  Node,
  Edge,
} from "reactflow";
import BaseNode from "@/layout/BaseNode";
import { Text } from "@chakra-ui/react";
import { CustomHandle } from "@/layout/CustomHandle";
import { createNewMint } from "@/util/createTokem";
import { Keypair, PublicKey, TransactionInstruction } from "@solana/web3.js";
import base58 from "bs58";
import { handleValue } from "@/util/helper";

const CreateToken: FC<NodeProps> = (props) => {
  const { getNode, setNodes, getEdges } = useReactFlow();
  const nodeId = useNodeId();
  const nodes = useNodes();

  const currentNodeObj = nodes.find((node) => node.id == nodeId);
  const [ix, setIx] = useState<TransactionInstruction[]>([]);
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

  const handleConnect = (e: Connection) => {
    if (!e.target) return;
    updateNodeData(e.target, ix);
  };

  useEffect(() => {
    if (!nodeId) return;
    const currentNode = getNode(nodeId);
    console.log("Transaction: ", currentNode);
    const symbolData: string[] = Object.values(currentNode?.data);
    const nodeKeys: string[] = Object.keys(currentNode?.data);
    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "privatekey",
      "rpc_url",
      "publickey",
      "name",
      "symbol",
      "description",
      "image",
    ]);
    const run = nodeKeys.find(
      (key) => key.startsWith("btn") && currentNode?.data[key] == true
    );
    if (symbolData && symbolData.length && run) {
      const mintKeypair = Keypair.generate();
      createNewMint(
        values["rpc_url"] ?? undefined,
        Keypair.fromSecretKey(base58.decode(values["privatekey"])),
        mintKeypair,
        new PublicKey(values["publickey"]),
        new PublicKey(values["publickey"]),
        new PublicKey(values["publickey"]),
        values["name"], //name
        values["symbol"], // symbol
        values["description"], //des
        values["image"] //image
      ).then((e) => {
        alert(e);
        console.log(e);
        setIx(e);
      });
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeObj?.data]);

  return (
    <BaseNode height="220px" {...props} title="Fetch Price">
      <CustomHandle
        pos="left"
        type="target"
        id="rpc_url"
        label="RPC URL"
        optional
        style={{ marginTop: "-6.7rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="run"
        label="Run"
        style={{ marginTop: "-4.7rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="privatekey"
        label="Private Key"
        style={{ marginTop: "-2.7rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="publickey"
        label="PublicKey"
        style={{ marginTop: "-0.7rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="name"
        label="Token Name"
        style={{ marginTop: "1.3rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="symbol"
        label="Symbol"
        style={{ marginTop: "3.3rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="description"
        label="Description"
        style={{ marginTop: "5.3rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="image"
        label="Image"
        style={{ marginTop: "7.3rem" }}
      />
      <CustomHandle
        onConnect={(e: any) => handleConnect(e)}
        pos="right"
        type="source"
        id="i"
        label="Instruction"
      />
    </BaseNode>
  );
};

export default CreateToken;
