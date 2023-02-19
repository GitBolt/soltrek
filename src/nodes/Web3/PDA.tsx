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

  const { getNode, setNodes } = useReactFlow();
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
    const currentNode = getNode(nodeId);
    const symbolData: string[] = Object.values(currentNode?.data);
    if (
      symbolData &&
      symbolData.length &&
      symbolData[0] &&
      symbolData[2] &&
      symbolData[1]
    ) {
      const newPDA = createPDA(
        symbolData[0],
        Buffer.from(symbolData[2]),
        Number(symbolData[1])
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
        {generatedPda}
        <VStack gap={6}>
          <CustomHandle
            pos="left"
            type="target"
            id="a"
            label="Program Id"
            style={{ marginTop: "-1.8rem" }}
          />
          <CustomHandle
            pos="left"
            type="target"
            id="b"
            label="bump"
            style={{ marginTop: "0.8rem" }}
          />
          <CustomHandle
            pos="left"
            type="target"
            id="c"
            label="seed"
            style={{ marginTop: "3.5rem" }}
          />
          <CustomHandle
            pos="right"
            type="source"
            id="c"
            label="PDA"
            onConnect={(e: any) => {
              updatePDA(e);
            }}
            style={{ marginTop: "-0.7rem" }}
          />
          <CustomHandle
            pos={Position.Right}
            type="source"
            id="c"
            label="Curve"
            onConnect={(e: any) => {}}
            style={{ marginTop: "3rem" }}
          />
        </VStack>
      </BaseNode>
    </>
  );
};

export default PDA;
