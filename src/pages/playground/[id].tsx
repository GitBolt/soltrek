import type { GetServerSidePropsContext, NextPage } from "next";
import Playground from "@/layouts/Playground";
import Sidebar from "@/layouts/Sidebar";
import { sidebarContent } from "@/util/sidebarContent";
import { CommandPalette } from "@/components/CommandPalette";
import { Navbar } from "@/layouts/Navbar";

import { io } from 'socket.io-client';
import { useEffect, useState, useRef } from "react";
import { useReactFlow, useNodesState, useEdgesState, NodeChange, EdgeChange } from "reactflow";
import { useWallet } from "@solana/wallet-adapter-react";
import { Flex } from "@chakra-ui/react";

const socket = io('http://localhost:3001');

const Home: NextPage = ({ playground }: any) => {
  const { toObject } = useReactFlow()

  const { publicKey } = useWallet()

  const [user, setUser] = useState(null)
  const [editAccess, setEditAccess] = useState(false)
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
    if (!publicKey) {
      setUser(null)
      setEditAccess(false)
      return
    }
    const run = async () => {
      const res = await fetch(`/api/user/${publicKey.toBase58()}`)
      if (res.ok) {
        const data = await res.json()
        setUser(data)
        console.log(data.id, playground.userId)
        setEditAccess(
          data.id == playground.userId ||
          playground.edit_access.includes(publicKey.toBase58())
        )

      }
    }
    run()
  }, [publicKey, playground])

  // useEffect(() => {

  //   socketRef.current.emit('update', { ...toObject() });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [nodes, edges])

  return (
    <>
      <Flex flexFlow="column" h="100%">
        <Navbar multiplayer />
        {editAccess && <Sidebar sidebarContent={sidebarContent} />}
        <CommandPalette />
        <Playground

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
  const res = await fetch(`http://localhost:3000/api/playground/get/id/${context.query.id}`)
  const data = await res.json()
  return { props: { playground: { ...data, createdAt: '' } } }
}
