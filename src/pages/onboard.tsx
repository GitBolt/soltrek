import type { NextPage } from "next";
import Playground from "@/layouts/Playground";
import { Flex } from "@chakra-ui/react";
import Sidebar from "@/layouts/Sidebar";
import { sidebarContent } from "@/util/sidebarContent";
import { CommandPalette } from "@/components/CommandPalette";
import { Navbar } from "@/layouts/Navbar";
import { useEdgesState, useNodesState } from "reactflow";
import { useContext, useEffect, useState } from "react";
import { Mixpanel } from "@/util/mixepanel";
import { Onboard } from "@/components/Onboard";


const Home: NextPage = () => {

  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [nodes, setNodes, onNodesChange] = useNodesState([{ "width": 242, "height": 102, "id": "node-3", "position": { "x": 731.5929063002006, "y": 330.90188444072294 }, "type": "mnemonic", "data": {}, "positionAbsolute": { "x": 731.5929063002006, "y": 330.90188444072294 }, "selected": false, "dragging": false }, { "width": 220, "height": 102, "id": "node-4", "position": { "x": 1043.9293561095349, "y": 391.7779972450719 }, "type": "keypair", "data": {}, "positionAbsolute": { "x": 1043.9293561095349, "y": 391.7779972450719 }, "selected": false, "dragging": false }, { "width": 220, "height": 102, "id": "node-5", "position": { "x": 453.04866475842323, "y": 261.9678050887535 }, "type": "buttonInput", "data": {}, "positionAbsolute": { "x": 453.04866475842323, "y": 261.9678050887535 }, "selected": false, "dragging": false }, { "width": 220, "height": 102, "id": "node-6", "position": { "x": 1461.0426733749766, "y": 237.50816591020478 }, "type": "textOutput", "data": {}, "positionAbsolute": { "x": 1461.0426733749766, "y": 237.50816591020478 }, "selected": false, "dragging": false }, { "width": 220, "height": 102, "id": "node-7", "position": { "x": 1464.0105254593702, "y": 453.1102751196262 }, "type": "textOutput", "data": {}, "selected": false, "positionAbsolute": { "x": 1464.0105254593702, "y": 453.1102751196262 }, "dragging": false }])
  const [pgName, setPgName] = useState<string>('Untitled')

  useEffect(() => {
    Mixpanel.track("home_page_load_onboard")
  }, [])

  return (
    <>
      <Flex flexFlow="column" h="100%">
        {/* <Onboard /> */}
        <Navbar pgName={pgName} setPgName={setPgName} />
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
