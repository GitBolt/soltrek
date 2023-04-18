/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { Flex, Button, List, ListItem, Divider, Text, Box, Icon } from '@chakra-ui/react'
import Branding from '@/components/Branding';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { SidebarContentType } from '@/types/sidebar';
import { createNodeId, createNodePos } from '@/util/randomData';

type Props = {
  sidebarContent: SidebarContentType[]
}
const Sidebar = ({ sidebarContent }: Props) => {
  const { setNodes, setEdges, setViewport } = useReactFlow();
  const [showSublist, setShowSublist] = useState<{ [key: number]: boolean }>({});
  const [selectedItemTitle, setSelectedItemTitle] = useState<string>('')

  const addNode = (type: string) => {
    setNodes((nodes) => nodes.concat({
      id: createNodeId(),
      position: createNodePos(),
      type,
      data: {}
    }))
  }

  const toggleSublist = (index: number) => {
    setShowSublist({
      ...showSublist,
      [index]: !showSublist[index],
    });
  };

  const { toObject } = useReactFlow()

  const onLoad = () => {
    const data = localStorage.getItem('state')
    if (!data) return
    const parsed = JSON.parse(data)
    setNodes(parsed.nodes || [])
    setEdges(parsed.edges || [])
    setViewport(parsed.viewport || [])
  }

  return (

    <Flex sx={{
      pos: "fixed",
      h: "100vh",
      w: "30rem",
      overflowY: "auto",
      overflowX: "hidden",
      zIndex: 2,
    }}>


      <Flex sx={{
        w: "30%",
        bg: "bg.400",
        h: "100%",
        flexFlow: "column",
        gap: "2rem",
        justifyContent: 'center',
      }}>
        {sidebarContent.map((item) => (
          <Flex
            cursor="pointer"
            _hover={{ bg: "bg.300" }}
            w="7rem"
            h="7rem"
            alignSelf="center"
            borderRadius="1rem"
            onClick={() => setSelectedItemTitle(item.title)}
            key={item.title}
            flexFlow="column"
            align="center"
            gap="1rem"
            justify="center"
          >
            <Box h="1.8rem" w="1.8rem">
              <img src={item.icon} alt="Icon" height="100%" width="100%" />
            </Box>
            <Text color="blue.200" fontWeight={500} fontSize="1.5rem">{item.title}</Text>
          </Flex>
        ))}
      </Flex>

      <Flex sx={{
        h: "100vh",
        w: "70%",
        bg: "bg.100",
        overflowY: "auto",
        overflowX: "hidden",
        border: "1px solid #2C294A",
        flexFlow: "column"
      }}>
        <Branding />

        <Divider />

        <Flex w="100%" p="0 2rem" gap="1rem" justify="space-between" my="2rem">
          <Button variant="outline" onClick={onLoad}>Load</Button>
          <Button variant="filled" onClick={() => localStorage.setItem("state", JSON.stringify(toObject()))}>Save</Button>
        </Flex>

        <List mb="2rem">
          {selectedItemTitle && sidebarContent.find((item) => item.title == selectedItemTitle)!.items.map((item, index) => (
            <ListItem key={item.title}>
              <Button
                variant="sidebar"
                onClick={() => item.sub ? toggleSublist(index) : addNode(item.type!)}
                rightIcon={item.sub ? (showSublist[index] ? <ChevronDownIcon /> : <ChevronRightIcon />) : undefined}>
                {item.title}
              </Button>

              {item.sub && showSublist[index] && (
                <List ml="1.5rem">
                  {item.sub.map((subItem) => (
                    <Flex key={subItem.title} align="center">
                      <ListItem w="100%" p="0 2rem 0 0">
                        <Button
                          variant="sidebar"
                          fontWeight="500"
                          color="blue.300"
                          fontSize="1.6rem"
                          onClick={() => addNode(subItem.type)}
                        >
                          {subItem.title}
                        </Button>
                      </ListItem>
                    </Flex>

                  ))}
                </List>
              )}
            </ListItem>
          ))}
        </List>

      </Flex>
    </Flex>

  )

}
export default Sidebar;
