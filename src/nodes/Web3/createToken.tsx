import React, { useState, useEffect, FC } from "react";
import {
  Position,
  NodeProps,
  useNodes,
  useNodeId,
  useReactFlow,
  Connection,
} from "reactflow";
import BaseNode from "@/layout/BaseNode";
import { Text } from "@chakra-ui/react";
import { CustomHandle } from "@/layout/CustomHandle";

const CreateToken: FC<NodeProps> = (props) => {
  const { getNode, setNodes } = useReactFlow();
  const nodeId = useNodeId();
  const nodes = useNodes();

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

  const handleConnect = (e: Connection) => {
    if (!e.target) return;
    // updateNodeData(e.target);
  };

  useEffect(() => {
    if (!nodeId) return;
    const currentNode = getNode(nodeId);
    console.log("Transaction: ", currentNode);
    const symbolData: string[] = Object.values(currentNode?.data);
    if (symbolData && symbolData.length) {
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeObj?.data]);

  return (
    <BaseNode {...props} title="Fetch Price">
      <CustomHandle
        pos="left"
        type="target"
        id="a"
        label="RPC URL"
        optional
        style={{ marginTop: "-1.8rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="b"
        label="Run"
        style={{ marginTop: "0.8rem" }}
      />
    </BaseNode>
  );
};

export default CreateToken;
