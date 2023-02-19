import BaseNode from "@/layout/BaseNode";
import { CustomHandle } from "@/layout/CustomHandle";
import { generatePDA } from "@/util/genratePDA";
import { Text } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import {
  Connection,
  Handle,
  NodeProps,
  Position,
  useNodeId,
  useNodes,
  useReactFlow,
} from "reactflow";

const PDA: FC<NodeProps> = (props) => {
  const [genratedPda, setGenratedPda] = useState<string | undefined>("");
  const [seed, setSeed] = useState<string>("");
  const [programId, setProgramId] = useState<string>("");
  const [bump, setBump] = useState<string>("");
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
  const updateProgramId = (e: Connection) => {
    if (!e.target) return;
    updateNodeData(e.target, programId);
  };
  useEffect(() => {
    if (!nodeId) return;
    const currentNode = getNode(nodeId);
    const symbolData: string[] = Object.values(currentNode?.data);
    if (seed && bump && programId) {
      const newPDA = generatePDA(programId, seed, bump);
      if (newPDA) {
        setGenratedPda(newPDA.toBase58());
      } else {
        setGenratedPda(undefined);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeObj?.data]);
  return (
    <>
      <BaseNode {...props} title="PDA">
        {genratedPda ? (
          <Text fontSize="2rem" color="blue.500">
            {genratedPda}
          </Text>
        ) : (
          <Text color="gray.100" fontSize="1.8rem">
            {"Empty..."}
          </Text>
        )}
        <CustomHandle
          pos="right"
          type="source"
          id="a"
          label="Program Id"
          onConnect={(e: any) => {
            updateProgramId(e);
          }}
          style={{ marginTop: "-0.7rem" }}
        />
      </BaseNode>
    </>
  );
};

export default PDA;
