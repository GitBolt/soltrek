import React, { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { Flex, Button, List, ListItem, ListIcon } from '@chakra-ui/react'
import Branding from '@/components/Branding';
import { ChevronRightIcon } from '@chakra-ui/icons';

const sidebarItems = [
  {
    title: "hi",
    type: "hit",
  },
  {
    title: "hi2",
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
      w: "20rem",
      bg: "bg.100",
      zIndex: 2,
      border: "1px solid #2C294A",
      flexFlow: "column"
    }}>
      <Branding />

      <List spacing={3}>
        {sidebarItems.map((item, index) => (
          <ListItem key={item.title}>
            <Button variant="sidebar" onClick={() => toggleSub(index)} w="90%" rightIcon={<ChevronRightIcon />}>
              {item.title}
            </Button>
            {item.sub && showSub[index] && (
              <Flex pl={5}>
                {item.sub.map(subItem => (
                  <ListItem key={subItem.title}>
                    <Button bg="none" color="#8482EB" fontSize="1.5rem" onClick={() => toggleSub(index)} w="90%" rightIcon={<ChevronRightIcon />}>
                      {item.title}
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
