import type { NextPage } from "next";
import Playground from "@/layouts/Playground";
import { Flex } from "@chakra-ui/react";
import Sidebar from "@/layouts/Sidebar";
import { sidebarContent } from "@/util/sidebarContent";
import { CommandPalette } from "@/components/CommandPalette";
import { Navbar } from "@/layouts/Navbar";
import { useEdgesState, useNodesState } from "reactflow";
import { useState } from "react";

const Home: NextPage = () => {

  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [pgName, setPgName] = useState<string>('Untitled')

  return (
    <>
      <Flex flexFlow="column" h="100%">
        <Navbar pgName={pgName} setPgName={setPgName}/>
        <Sidebar sidebarContent={sidebarContent} />
        <CommandPalette />
        <Playground
          edges={edges}
          nodes={nodes}

          setEdges={setEdges}
          setNodes={setNodes}

          onNodeChange={onNodesChange}
          onEdgeChange={onEdgesChange}
        />
      </Flex>
    </>
  );
};

export default Home;
