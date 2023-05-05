import type { GetServerSidePropsContext, NextPage } from "next";
import Playground from "@/layouts/Playground";
import Sidebar from "@/layouts/Sidebar";
import { sidebarContent } from "@/util/sidebarContent";
import { CommandPalette } from "@/components/CommandPalette";
import { Navbar } from "@/layouts/Navbar";

import { io } from 'socket.io-client';
import { useEffect, useState, useRef } from "react";
import { useReactFlow, useNodes, useEdges, useNodesState, useEdgesState, NodeChange, EdgeChange } from "reactflow";
import { useWallet } from "@solana/wallet-adapter-react";
import { Flex } from "@chakra-ui/react";

const socket = io('http://localhost:3001');

const Home: NextPage = ({ playground }: any) => {
  const { getNodes, getEdges, toObject } = useReactFlow()

  const { publicKey } = useWallet()

  const [user, setUser] = useState(null)
  const [isAllowed, setIsAllowed] = useState(false)
  const socketRef = useRef(socket)

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  socketRef.current.on("serverUpdate", (playground) => {
  })

  const nodeChangeHandler = (changes: NodeChange[]) => {
    console.log("Change to nodes", changes)
    onNodesChange(changes)
  }

  const edgeChangeHandler = (changes: EdgeChange[]) => {
    console.log("Change to edges")
    onEdgesChange(changes)
  }

  useEffect(() => {
    if (!publicKey) {
      setUser(null)
      return
    }
    const run = async () => {
      const res = await fetch(`/api/user/${publicKey.toBase58()}`)
      if (res.ok) {
        const data = await res.json()
        setUser(data)
        setIsAllowed(playground.edit_access.includes(publicKey.toBase58()))
      }
    }
    run()
  }, [publicKey, playground])

  useEffect(() => {

    socketRef.current.emit('update', { ...toObject() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges])

  return (
    <>
      <Flex flexFlow="column" h="100%">
        <Navbar />
        <Sidebar sidebarContent={sidebarContent} />
        <CommandPalette />
        <Playground

          readOnly={!isAllowed}
          edges={edges}
          nodes={nodes}

          setEdges={setEdges}
          setNodes={setNodes}

          onNodeChange={nodeChangeHandler}
          onEdgeChange={onEdgesChange}
        />
      </Flex>
    </>
  );
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const res = await fetch(`http://localhost:3000/api/playground/get/id/${context.query.id}`)
  const data = await res.json()
  return { props: { playground: { ...data, createdAt: '' } } }
}
