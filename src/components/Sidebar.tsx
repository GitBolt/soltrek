import React, { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { Flex, Button, List, ListItem, ListIcon, Divider } from '@chakra-ui/react'
import Branding from '@/components/Branding';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';

const sidebarItems = [
  {
    title: "Input",
    type: "input",
    sub: [
      {
        title: "hi3",
        type: "hit3"
      }
    ]
  },
  {
    title: "Math",
    type: "hit2",
    sub: [
      {
        title: "hi3",
        type: "hit3"
      }
    ]
  }
]

const Sidebar = () => {
  const { setNodes } = useReactFlow();
  const [showSub, setShowSub] = useState<{ [key: number]: boolean }>({});

  const toggleSub = (index: number) => {
    setShowSub({
      ...showSub,
      [index]: !showSub[index],
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
              onClick={() => toggleSub(index)}
              rightIcon={item.sub.length ? (showSub[index] ? <ChevronDownIcon /> : <ChevronRightIcon />) : undefined}>
              {item.title}
            </Button>
            {item.sub.length && showSub[index] && (
              <Flex pl={5}>
                {item.sub.map(subItem => (
                  <ListItem key={subItem.title}>
                    <Button bg="none" color="#8482EB" fontSize="1.5rem" onClick={() => toggleSub(index)} w="90%">
                      {subItem.title}
                    </Button>
                  </ListItem>
                ))}
              </Flex>
            )}
          </ListItem>
        ))}
      </List>

    </Flex>
  )

}
export default Sidebar;
