import BaseNode from "@/layout/BaseNode";
import { CustomHandle } from "@/layout/CustomHandle";
import { createPDA, generatePDA } from "@/util/genratePDA";
import { VStack } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import {
  Connection,
  NodeProps,
  Position,
  useNodeId,
  useNodes,
  useReactFlow,
} from "reactflow";

const PDA: FC<NodeProps> = (props) => {
  const [generatedPda, setGeneratedPda] = useState<string | undefined>("");
  const [currentPDA, setCurrentPDA] = useState<string[]>([]);

  const { getNode, setNodes, getEdges, getEdge } = useReactFlow();
  const nodeId = useNodeId();
  const nodes = useNodes();

  const currentNodeObj = nodes.find((node) => node.id == nodeId);

  const updateNodeData = (nodeId: string, data: string) => {
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
  const updatePDA = (e: Connection) => {
    if (!e.target) return;
    updateNodeData(e.target, generatedPda as string);
    setCurrentPDA([...currentPDA, e.target]);
  };
  useEffect(() => {
    currentPDA.forEach((target) =>
      updateNodeData(target, generatedPda as string)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedPda]);
  useEffect(() => {
    if (!nodeId) return;
    let edge_id = Object();
    const currentNode = getNode(nodeId);
    const edges = getEdges();
    console.log(edges);
    edges.map((e) => {
      edge_id = {
        ...edge_id,
        [e.targetHandle as any]: e.source,
      };
    });
    const symbolData: string[] = Object.values(currentNode?.data);
    console.log(currentNode?.data, edge_id, "--ar");

    if (symbolData && symbolData.length) {
      const newPDA = createPDA(
        currentNode?.data[String(edge_id["program_id"])],
        Buffer.from(currentNode?.data[String(edge_id["seed"])]),
        Number(currentNode?.data[String(edge_id["bump"])])
      );
      if (newPDA) {
        setGeneratedPda(newPDA.toBase58());
      } else {
        setGeneratedPda(undefined);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeObj?.data]);
  return (
    <>
      <BaseNode {...props} title="PDA">
        <VStack gap={6}>
          <CustomHandle
            pos="left"
            type="target"
            id="program_id"
            label="Program Id"
            style={{ marginTop: "-1.8rem" }}
          />
          <CustomHandle
            pos="left"
            type="target"
            id="bump"
            label="Bump"
            style={{ marginTop: "0.8rem" }}
          />
          <CustomHandle
            pos="left"
            type="target"
            id="seed"
            label="Seed"
            style={{ marginTop: "3.5rem" }}
          />
          <CustomHandle
            pos="right"
            type="source"
            id="pda"
            label="PDA"
            onConnect={(e: any) => {
              updatePDA(e);
            }}
            style={{ marginTop: "-0.7rem" }}
          />
          {/* <CustomHandle
            pos={Position.Right}
            type="source"
            id="c"
            label="Curve"
            onConnect={(e: any) => {}}
            style={{ marginTop: "3rem" }}
          /> */}
        </VStack>
      </BaseNode>
    </>
  );
};

export default PDA;
