import React, { useState, useEffect, FC } from "react";
import { NodeProps, useNodeId, useReactFlow, Connection } from "reactflow";
import base58 from "bs58";
import BaseNode from "@/layout/BaseNode";
import { CustomHandle } from "@/layout/CustomHandle";
import { CreateMintCode, createNewMint } from "@/util/createToken";
import { Keypair, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { handleValue } from "@/util/helper";

const CreateToken: FC<NodeProps> = (props) => {
  const { getNode, setNodes, getEdges } = useReactFlow();
  const nodeId = useNodeId();
  const currentNode = getNode(nodeId as string);

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
    const dataKeys: string[] = Object.keys(currentNode?.data || {});

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

    const run = dataKeys.find(
      (key) => key.startsWith("btn") && currentNode?.data[key] == true
    );
    if (!Object.values(values).length || !run) return;

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);

  return (
    <BaseNode
      code={CreateMintCode}
      height="22rem"
      {...props}
      title="Create Token"
    >
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
