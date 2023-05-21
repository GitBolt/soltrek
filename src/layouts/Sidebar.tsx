/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useReactFlow } from 'reactflow';
import { Flex, Button, List, ListItem, Text, Box } from '@chakra-ui/react'
import Branding from '@/components/Branding';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { SidebarContentType } from '@/types/sidebar';
import { createNodeId, createNodePos } from '@/util/randomData';
import { getUser } from '@/util/program/user';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';
import { Mixpanel } from '@/util/mixepanel';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

type Props = {
  sidebarContent: SidebarContentType[],
  multiplayer?: boolean
}
const Sidebar = ({ sidebarContent, multiplayer }: Props) => {
  const { setNodes } = useReactFlow();
  const [showSublist, setShowSublist] = useState<{ [key: number]: boolean }>({});
  const [selectedItemTitle, setSelectedItemTitle] = useState<string>('Input')
  const [user, setUser] = useState(null)
  const wallet = useAnchorWallet()

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

  const handleNodeAdd = (type: string, title: string) => {
    console.log(type,)
    addNode(type)
    Mixpanel.track("node_add", { type, title })
  }

  useEffect(() => {
    if (!wallet) return
    const run = async () => {
      const data = await getUser(wallet as NodeWallet)
      setUser(data)
    }
    run()
  }, [wallet])

  return (

    <Flex sx={{
      pos: "fixed",
      h: "100vh",
      w: "36rem",
      overflowY: "auto",
      overflowX: "hidden",
      zIndex: 2,
    }}>

      <Flex sx={{
        w: "25%",
        bg: "bg.200",
        h: "100%",
        flexFlow: "column",
        boxShadow: "3px 0px 15px rgba(0, 0, 0, 0.36)",
        zIndex: 3,
        borderRadius: "0 5rem 5rem 0",
        gap: "2rem",
        justifyContent: 'center',

      }}>
        {sidebarContent.map((item) => (
          <Flex
            cursor="pointer"
            _hover={{ bg: "bg.400" }}
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
            bg={item.title == selectedItemTitle ? 'bg.400' : 'transparent'}
            boxShadow={item.title == selectedItemTitle ?
              'inset -4px -4px 5px rgba(52, 53, 87, 0.25), inset 4px 4px 5px rgba(0, 0, 0, 0.25)' :
              '-4px -4px 5px rgba(52, 53, 87, 0.25), 4px 4px 5px rgba(0, 0, 0, 0.25)'
            }
          >
            <Box h="1.8rem" w="1.8rem">
              <img src={item.icon} style={{ filter: `hue-rotate(350deg)` }} alt="Icon" height="100%" width="100%" />
            </Box>
            <Text color="blue.100" fontWeight={500} fontSize="1.5rem">{item.title}</Text>
          </Flex>
        ))}
      </Flex>

      <Flex sx={{
        w: "75%",
        background: "bg.100",
        borderRight: "1px solid",
        borderColor: "gray.100",
        flexFlow: "column",
        height: "100%",
      }}>
        <Box mt="8rem" />
        <Branding />

        {!multiplayer ?

          <Flex w="100%" borderRadius="2rem 2rem 0 0" h="4rem" align="center" justify="center" bg="bg.300">
            <Text color="blue.100" fontWeight={600} fontSize="1.8rem">
              Single Player
            </Text>
          </Flex>
          :
          <Flex w="100%" borderRadius="2rem 2rem 0 0" h="4rem" align="center" justify="center" bg="magenta.400">
            <Text color="magenta.100" fontWeight={600} fontSize="1.8rem">
              Multi Player
            </Text>
          </Flex>}

        <List mb="2rem">
          {selectedItemTitle && sidebarContent.find((item) => item.title == selectedItemTitle)!.items.map((item, index) => (
            <ListItem key={item.title}>
              <Button
                borderTop={index == 0 ? "1px solid" : "none"}
                borderBottom="1px solid"
                borderColor="gray.100"
                leftIcon={item.icon ?
                  <Box as="span" w="3rem" h="3rem" mr="-5rem">
                    <img src={item.icon} alt="Logo" height="100%" width="100%" />
                  </Box>
                  : undefined}
                borderRadius="0"
                variant="sidebar"
                color={item.sub?.length ? "white.100" : "blue.200"}
                onClick={() => item.sub ? toggleSublist(index) : handleNodeAdd(item.type, item.title)}
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
                          fontSize="1.5rem"
                          onClick={() => handleNodeAdd(subItem.type, item.title)}
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

        <Box mt="auto">
          <ThemeSwitcher />
        </Box>
      </Flex>
    </Flex>

  )

}
export default Sidebar;
