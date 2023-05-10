import { useNetworkContext } from "@/context/configContext";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { handleValue } from "@/util/handleNodeValue";
import { Connection, PublicKey } from "@solana/web3.js";
import React, { FC, useEffect, useState } from "react";
import {
  Connection as RCon,
  NodeProps,
  useNodeId,
  useReactFlow,
} from "reactflow";

const RequestAirdrop: FC<NodeProps> = (props) => {
  const [txid, setTxid] = useState<string>("");
  const { selectedNetwork } = useNetworkContext()
  const [sigOutputs, setSigOutputs] = useState<string[]>([]);

  const { getNode, setNodes, setEdges, getEdges } = useReactFlow();
  const id = useNodeId();

  const currentNode = getNode(id as string);

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

  const updateSigOutput = (e: RCon) => {
    if (!e.target) return;
    updateNodeData(e.target, txid as string);
    setSigOutputs([...sigOutputs, e.target]);
  };

  useEffect(() => {
    sigOutputs.forEach((target) => updateNodeData(target, txid as string));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txid]);

  useEffect(() => {
    const dataKeys: string[] = Object.keys(currentNode?.data || {});

    const edges = getEdges();
    const values = handleValue(currentNode, edges, ["rpc_url", "destination"]);
    const run = dataKeys.find(
      (key) => key.startsWith("btn") && currentNode?.data[key] == true
    );
    if (!Object.values(values).length || !run) return;

    setEdges((edgs) =>
      edgs.map((ed) => {
        if (ed.source == id) {
          ed.animated = true;
          return ed;
        }
        return ed;
      })
    );

    const connection = new Connection(
      values["rpc_url"] || selectedNetwork
      , { commitment: "confirmed" });
    connection
      .requestAirdrop(new PublicKey(values["destination"]), 2)
      .then((res) => setTxid(res))
      .then(() =>
        setEdges((edgs) =>
          edgs.map((ed) => {
            if (ed.source == id) {
              ed.animated = false;
              return ed;
            }
            return ed;
          })
        )
      );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);

  const AirdropCode = `
    const connection = new Connection(RPC_URL || "https://solana-devnet.g.alchemy.com/v2/uUAHkqkfrVERwRHXnj8PEixT8792zETN")
    connection.requestAirdrop(new PublicKey(values["destination"]), 2)
      .then((res) => console.log(res))
      
  `;

  return (
    <>
      <BaseNode {...props} code={AirdropCode} title="Request SOL Airdrop">
        <CustomHandle
          pos="left"
          type="target"
          id="rpc_url"
          label="RPC URL"
          optional
          style={{ marginTop: "-1.8rem" }}
        />
        <CustomHandle
          pos="left"
          type="target"
          id="run"
          label="Run"
          style={{ marginTop: "0.8rem" }}
        />
        <CustomHandle
          pos="left"
          type="target"
          id="destination"
          label="Destination"
          style={{ marginTop: "3.5rem" }}
        />
        <CustomHandle
          pos="right"
          type="source"
          id="source"
          label="Signature"
          onConnect={(e: any) => {
            updateSigOutput(e);
          }}
        />
      </BaseNode>
    </>
  );
};

export default RequestAirdrop;
