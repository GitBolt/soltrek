import React, { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { Flex, Button, List, ListItem, Divider } from '@chakra-ui/react'
import Branding from '@/components/Branding';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { SidebarItemType } from '@/types/sidebar';
import { createNodeId, createNodePos } from '@/util/randomData';

type Props = {
  sidebarItems: SidebarItemType[]
}
const Sidebar = ({ sidebarItems }: Props) => {
  const { setNodes } = useReactFlow();
  const [showSublist, setShowSublist] = useState<{ [key: number]: boolean }>({});


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

  return (
    <Flex sx={{
      pos: "fixed",
      h: "100vh",
      w: "25rem",
      bg: "bg.100",
      zIndex: 2,
      border: "1px solid #2C294A",
      flexFlow: "column"
    }}>
      <Branding />

      <Divider />

      <Flex w="100%" p="0 2rem" justify="space-between" my="2rem">
        <Button variant="outline">Load</Button>
        <Button variant="filled">Save</Button>
      </Flex>

      <List>
        {sidebarItems.map((item, index) => (
          <ListItem key={item.title}>
            <Button
              variant="sidebar"
              onClick={() => toggleSublist(index)}
              rightIcon={item.sub.length ? (showSublist[index] ? <ChevronDownIcon /> : <ChevronRightIcon />) : undefined}>
              {item.title}
            </Button>

            {item.sub.length && showSublist[index] && (
              <List ml="4rem">
                {item.sub.map((subItem, index) => (
                  <Flex key={subItem.title} align="center">
                    <Divider
                      orientation='vertical'
                      h={index == item.sub.length - 1 ? "1.9rem" : "3.8rem"}
                      mb={index == item.sub.length - 1 ? "2rem" : "0"}
                      borderColor="gray.100"
                      borderWidth="2px"
                      borderRadius="2rem" />
                    <Divider
                      orientation='horizontal'
                      w="2.5rem"
                      borderColor="gray.100"
                      borderWidth="2px"
                      borderRadius="2rem" />
                    <ListItem w="100%" p="0 2rem 0 0">
                      <Button
                        variant="sidebar"
                        fontWeight="500"
                        color="blue.300"
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
  )

}
export default Sidebar;
