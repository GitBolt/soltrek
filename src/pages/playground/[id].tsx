import type { GetServerSidePropsContext, NextPage } from "next";
import Playground from "@/layouts/Playground";
import Sidebar from "@/layouts/Sidebar";
import { sidebarContent } from "@/util/sidebarContent";
import { CommandPalette } from "@/components/CommandPalette";
import { Navbar } from "@/layouts/Navbar";

import { io } from 'socket.io-client';
import { useEffect, useState, useRef } from "react";
import { useNodesState, useEdgesState, NodeChange, EdgeChange } from "reactflow";
import { Flex } from "@chakra-ui/react";

const socket = io(process.env.NEXT_PUBLIC_SERVER_URL as string);

const Home: NextPage = ({ playground }: any) => {
  const [editAccess, setEditAccess] = useState(false)
  const [pgName, setPgName] = useState<string>('')
  const socketRef = useRef(socket)

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  socketRef.current.on("serverUpdate", (data) => {
    setNodes(data.nodes)

    if (data.edges) {
      setEdges(data.edges)
    }
  })

  const nodeChangeHandler = (changes: NodeChange[]) => {
    socketRef.current.emit("update", { nodes })
    onNodesChange(changes)
  }

  const edgeChangeHandler = (changes: EdgeChange[]) => {
    socketRef.current.emit("update", { edges })
    onEdgesChange(changes)
  }


  useEffect(() => {
    if (!playground.data) return
    const data = JSON.parse(playground.data)
    setNodes(data.nodes)
    setEdges(data.edges)
    setPgName(playground.name)
  }, [playground, setEdges, setNodes])

  return (
    <>
      <Flex flexFlow="column" h="100%">
        <Navbar pgName={pgName} setPgName={setPgName} multiplayer setEditAccess={setEditAccess} />
        {editAccess && <Sidebar sidebarContent={sidebarContent} multiplayer />}
        <CommandPalette />
        <Playground
          multiplayer

          editable={editAccess}
          edges={edges}
          nodes={nodes}

          setEdges={setEdges}
          setNodes={setNodes}

          onNodeChange={nodeChangeHandler}
          onEdgeChange={edgeChangeHandler}
        />
      </Flex>
    </>
  );
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  console.log(context.query.id)
  const res = await fetch(`https://soltrek.spaceoperator.com/api/playground/get/id/${context.query.id}`)
  const data = await res.json()
  return { props: { playground: { ...data, createdAt: '' } } }
}
