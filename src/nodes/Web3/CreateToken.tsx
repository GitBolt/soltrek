import React, { useState, useEffect, FC } from "react";
import { NodeProps, useNodeId, useReactFlow, Connection } from "reactflow";
import base58 from "bs58";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { createNewMint } from "@/util/createToken";
import { Keypair, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { handleValue } from "@/util/handleNodeValue";
import { useNetworkContext } from "@/context/configContext";

const CreateToken: FC<NodeProps> = (props) => {
  const { getNode, setNodes, getEdges, setEdges } = useReactFlow();
  const id = useNodeId();
  const currentNode = getNode(id as string);
  const [targetNodes, setTargetNodes] = useState<string[]>([])
  const [ix, setIx] = useState<TransactionInstruction[]>([]);
  const { selectedNetwork } = useNetworkContext()

  // Update target nodes (accepting input) data with 100ms delay (required to work properly)
  const updateNodeData = (nodeIds: string[]) => {
    setTimeout(() => {
      setNodes(nodes => nodes.map(node =>
        nodeIds.includes(node.id)
          ? { ...node, data: { ...node.data, [id as string]: ix } }
          : node
      ));
    }, 100);
  };

  // Updating a new input node with data from this node as soon as it's connected
  const onConnect = (e: Connection) => {
    if (!e.target) return
    setTargetNodes([...targetNodes, e.target])
    updateNodeData([e.target])
  };

  // Pushing new data to all input nodes connected
  useEffect(() => {
    if (!targetNodes) return
    updateNodeData(targetNodes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ix])




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

    if (Object.values(values).filter(i => i).length != 6 || !run) return;

    const privKey: string = values["privatekey"]

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

    setEdges((edgs) =>
      edgs.map((ed) => {
        if (ed.source == id) {
          ed.animated = true;
          return ed;
        }
        return ed;
      })
    );
    createNewMint(
      values["rpc_url"] || selectedNetwork,
      Keypair.fromSecretKey(parsed),
      new PublicKey(values["publickey"]),
      new PublicKey(values["publickey"]),
      new PublicKey(values["publickey"]),
      values["name"],
      values["symbol"],
      values["description"],
      values["image"]
    ).then((e) => {
      console.log("Create Token Ix ", e);
      setEdges((edgs) =>
        edgs.map((ed) => {
          if (ed.source == id) {
            ed.animated = false;
            return ed;
          }
          return ed;
        })
      );
      setIx(e);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);

  const cleanedCode = createNewMint.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const createNewMint = ${cleanedCode}`;

  return (
    <BaseNode
      code={CODE}
      height="30rem"
      {...props}
      title="Create Token"
    >

      <CustomHandle
        pos="left"
        type="target"
        id="run"
        label="Create"
        style={{ marginTop: "-10rem" }}
      />

      <CustomHandle
        pos="left"
        type="target"
        id="rpc_url"
        label="RPC URL"
        optional
        style={{ marginTop: "-7rem" }}
      />

      <CustomHandle
        pos="left"
        type="target"
        id="publickey"
        label="PublicKey"
        style={{ marginTop: "-4rem" }}

      />
      <CustomHandle
        pos="left"
        type="target"
        id="privatekey"
        label="Private Key"
        style={{ marginTop: "-1rem" }}

      />

      <CustomHandle
        pos="left"
        type="target"
        id="name"
        label="Token Name"
        style={{ marginTop: "2rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="symbol"
        label="Symbol"
        style={{ marginTop: "5rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="description"
        label="Description"
        style={{ marginTop: "8rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="image"
        label="Image"
        style={{ marginTop: "11rem" }}
      />
      <CustomHandle
        onConnect={onConnect}
        pos="right"
        type="source"
        id="i"
        label="Instruction"
      />
    </BaseNode>
  );
};

export default CreateToken;
