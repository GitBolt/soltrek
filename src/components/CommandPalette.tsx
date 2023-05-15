/* eslint-disable @next/next/no-img-element */
import { useState, useRef, useEffect } from "react";
import {
  Input,
  List,
  Modal,
  Flex,
  ListItem,
  Text,
  ModalContent,
  ModalOverlay,
  Box,
  Divider,
  useToast
} from "@chakra-ui/react";
import { useReactFlow } from "reactflow";
import { sidebarContent } from "@/util/sidebarContent";
import { createNodeId, createNodePos } from "@/util/randomData";
import { SearchResult, searcher } from "@/util/searcher";
import { useCustomModal } from "@/context/modalContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { Mixpanel } from "@/util/mixepanel";


export const CommandPalette = () => {

  const { cmdPalette, savedPg } = useCustomModal()

  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [filteredItems, setFilteredItems] = useState<SearchResult[]>([]);
  const { setNodes } = useReactFlow()
  const listRef = useRef(null)

  const [selectedResult, setSelectedResult] = useState<string>('');
  const { publicKey } = useWallet()
  const toast = useToast()
  const addNode = (type: string) => {
    setNodes((nodes) => nodes.concat({
      id: createNodeId(),
      position: createNodePos(),
      type,
      data: {}
    }))
  }

  const handleKeyDown = (event: any) => {
    if (event.key === "k" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      cmdPalette.onOpen();
      inputRef.current?.focus();
    }

    if (event.key === "Escape" && cmdPalette.isOpen) {
      event.preventDefault();
      cmdPalette.onClose();
    }

    if (event.key === "Enter" && cmdPalette.isOpen) {
      event.preventDefault();
      if (!filteredItems) return

      addNode(selectedResult || "stringInput");
      Mixpanel.track("node_add", { type: selectedResult, from_cmd: true })
    }

    if (event.key === "ArrowUp" && cmdPalette.isOpen) {
      event.preventDefault();
      if (!filteredItems) return

      const selectedIndex = filteredItems.indexOf(filteredItems.find((item) => item.type == selectedResult)!)
      setSelectedResult(filteredItems[selectedIndex - 1].type)
    }

    if (event.key === "ArrowDown" && cmdPalette.isOpen) {
      event.preventDefault();
      if (!filteredItems) return

      const selectedIndex = filteredItems.indexOf(filteredItems.find((item) => item.type == selectedResult)!)
      setSelectedResult(filteredItems[selectedIndex + 1].type)
    }
  };


  const handleClickOutside = (e: any) => {
    if (!listRef.current || !e.target) return;

    // @ts-ignore
    if (!listRef.current.contains(e.target)) {
      cmdPalette.onOpen();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredItems, selectedResult]);


  useEffect(() => {
    if (searchValue.trim() === '') {
      setFilteredItems([]);
      return;
    }

    const searched = searcher(searchValue)
    setFilteredItems(searched)
    if (searched.length) {
      setSelectedResult(searched[0].type)
    }
  }, [searchValue]);



  return (
    <Modal isOpen={cmdPalette.isOpen} onClose={cmdPalette.onClose} initialFocusRef={inputRef}>
      <ModalOverlay bg="#00000040" />
      <ModalContent
        minH="50vh"
        h="40rem"
        maxW="30vw"
        bg=" linear-gradient(243.86deg, rgba(38, 42, 55, 0.33) 0%, rgba(36, 55, 78, 0) 100.97%);"
        border="0.5px solid rgba(82, 82, 111, 0.3)"
        style={{ backdropFilter: 'blur(15px)' }}
        boxShadow="0px 0px 40px #0003"
        borderRadius="1rem">
        <Flex
          ref={listRef}
          overflow="auto"
          flexFlow="column"
          align="center"
          p="1rem"
          borderRadius="1rem"
        >

          <Input
            pos="static"
            ref={inputRef}
            placeholder="Search for nodes"
            value={searchValue}
            w="90%"
            mb="1rem"
            variant="flushed"
            h="4rem"
            fontSize="1.8rem"
            // onKeyDown={handleKeyDown} // Add this line
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <List w="90%">

            {!filteredItems.length && <Text fontSize="1.4rem" color="blue.400" mb="1rem" fontWeight={600}>{searchValue ? 'No results found...' : 'Start searching to get items from these categories'}</Text>
            }
            {filteredItems.length
              ? filteredItems.map((item) => (
                <ListItem
                  key={item.type + item.title + item.level}
                  p="1rem 1rem"
                  borderRadius="0.75rem"
                  _hover={{ bg: "#23213987" }}
                  onClick={() => addNode(item.type || "stringInput")}
                  bg={selectedResult === item.type ? "#23213987" : "transparent"}
                >

                  <Flex justify="start" align="center" gap="2rem">
                    <Box w="1.8rem" h="1.8rem">
                      <img src={item.icon} height="100%" width="100%" alt="Icon"/>
                    </Box>


                    <Text fontSize="1.6rem" color="blue.200" fontWeight={500}>
                      {item.title}
                    </Text>

                    {item.parentTitle &&
                      <Text fontSize="1.6rem" ml="auto" color="blue.400" fontWeight={500}>
                        {item.parentTitle}
                      </Text>}
                  </Flex>
                </ListItem>
              ))
              : !searchValue && (
                <>
                  {sidebarContent.map((item) => (
                    <ListItem
                      key={item.title}
                      p="1rem 1rem"
                      borderRadius="0.75rem"
                    >
                      <Flex justify="start" align="center" gap="2rem" opacity="0.5">
                        <Box w="1.8rem" h="1.8rem">
                          <img src={item.icon} height="100%" width="100%" alt="Icon"/>
                        </Box>
                        <Text fontSize="1.6rem" color="blue.200" fontWeight={500}>
                          {item.title}
                        </Text>
                      </Flex>
                    </ListItem>
                  ))}
                  < Divider />
                  <ListItem
                    _hover={{ bg: "#23213987" }}
                    p="1rem 1rem"
                    borderRadius="0.75rem"
                  >
                    <Flex justify="space-between" align="center">
                      <Flex justify="center"
                        onClick={() => {
                          if (!publicKey) {
                            toast({
                              status: "error",
                              title: "Connect Wallet Required"
                            })
                            return
                          }
                          savedPg.onOpen()
                        }} align="center" gap="2rem">
                        <Box w="1.8rem" h="1.8rem">
                          <img src="/icons/Load.svg" height="100%" width="100%" alt="Icon"/>
                        </Box>
                        <Text fontSize="1.6rem" color="blue.200" fontWeight={500}>
                          Load playground
                        </Text>
                      </Flex>
                      <Text fontSize="1.6rem" bg="gray.100" p="0.2rem" borderRadius="5px" color="magenta.100" fontWeight={500}>
                        ⌘ + L
                      </Text>
                    </Flex>
                  </ListItem>
                </>
              )
            }

          </List>

        </Flex>
      </ModalContent>
    </Modal >
  )
}