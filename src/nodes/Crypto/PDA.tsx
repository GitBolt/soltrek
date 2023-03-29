import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { createPDA } from "@/util/generatePDA";
import { handleValue } from "@/util/handleNodeValue";
import React, { FC, useEffect, useState } from "react";
import {
  Connection,
  NodeProps,
  useNodeId,
  useReactFlow,
} from "reactflow";

const PDA: FC<NodeProps> = (props) => {
  const [generatedPda, setGeneratedPda] = useState<string | undefined>("");
  const [currentPDA, setCurrentPDA] = useState<string[]>([]);

  const { getNode, setNodes, getEdges } = useReactFlow();
  const id = useNodeId();

  const currentNode = getNode(id as string)

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

    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "program_id",
      "seed",
      "bump"
    ])

    const programId = values["program_id"]
    const seed = values["seed"]
    const bump = values["bump"]
    if (!programId || !seed || !bump) return

    const newPDA = createPDA(
      programId,
      Buffer.from(seed),
      Number(bump)
    );
    if (newPDA) {
      setGeneratedPda(newPDA.toBase58());
    } else {
      setGeneratedPda(undefined);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);

  const cleanedCode = createPDA.toString().replace(/_.*?(\.|import)/g, '');;
  const CODE = `export const createPDA = ${cleanedCode}`;

  return (
    <>
      <BaseNode {...props} title="PDA" code={CODE}>
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
      </BaseNode>
    </>
  );
};

export default PDA;
