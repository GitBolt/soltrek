import { useState, useRef, useEffect } from "react";
import {
  Input,
  List,
  Modal,
  ModalBody,
  Grid,
  Flex,
  Button,
  ListItem,
  Divider,
  Text,
  useDisclosure,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  Box
} from "@chakra-ui/react";
import { useReactFlow } from "reactflow";
import { sidebarContent } from "@/util/sidebarContent";
import { createNodeId, createNodePos } from "@/util/randomData";
import { SearchResult, searcher } from "@/util/searcher";


export const CommandPalette = () => {

  const { isOpen, onClose, onOpen } = useDisclosure()

  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [filteredItems, setFilteredItems] = useState<SearchResult[]>([]);
  const [activeItemType, setActiveItemType] = useState<string>("")
  const { setNodes } = useReactFlow()
  const listRef = useRef(null)


  const addNode = (type: string) => {
    setNodes((nodes) => nodes.concat({
      id: createNodeId(),
      position: createNodePos(),
      type,
      data: {}
    }))
  }

  const handleKeyDown = (event: any) => {
    if (event.key === "k" && event.ctrlKey) {
      event.preventDefault()
      onOpen()
      inputRef.current?.focus();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (filteredItems.length > 0) {
        setActiveItemType((prevType) => {
          const currentIndex = filteredItems.findIndex((item) => item.type === prevType);
          const newIndex = Math.max(currentIndex - 1, 0);
          return filteredItems[newIndex]?.type || "";
        });
      }
    }
  
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (filteredItems.length > 0) {
        setActiveItemType((prevType) => {
          const currentIndex = filteredItems.findIndex((item) => item.type === prevType);
          const newIndex = Math.min(currentIndex + 1, filteredItems.length - 1);
          return filteredItems[newIndex]?.type || "";
        });
      }
    }
    

    if (event.key === "Escape" && isOpen) {
      event.preventDefault()
      onClose()
    }

    if (event.key === "Enter") {
      event.preventDefault();
      addNode(activeItemType || filteredItems[0]?.type || "stringInput");
    }
  };

  const handleClickOutside = (e: any) => {
    if (!listRef.current || !e.target) return;

    // @ts-ignore
    if (!listRef.current.contains(e.target)) {
      onOpen();
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
  }, [filteredItems]);


  useEffect(() => {
    if (searchValue.trim() === '') {
      setFilteredItems([]);
      return;
    }

    const searched = searcher(searchValue)
    setFilteredItems(searched)

  }, [searchValue]);

  useEffect(() => {
    if (searchValue.trim() === '') {
      setFilteredItems([]);
      return;
    }
  
    const searched = searcher(searchValue)
    setFilteredItems(searched)
  
  }, [searchValue]);
  

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={inputRef}>
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
            h="4rem"
            fontSize="1.8rem"
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <List w="90%">

            {!filteredItems.length && <Text fontSize="1.4rem" color="blue.300" mb="1rem" fontWeight={600}>Start searching to get items from these categories</Text>
            }
            {filteredItems.length
              ? filteredItems.map((item, index) => (
                <ListItem
                  key={item.title}
                  p="1rem 1rem"
                  borderRadius="0.75rem"
                  _hover={{ bg: "bg.300" }}
                  bg={activeItemType === item.type ? "bg.300" : "transparent"}
                  onClick={() => addNode(item.type || "stringInput")}
                >
                  <Flex justify="start" align="center" gap="2rem">
                    <Box w="1.8rem" h="1.8rem">
                      <img src={item.icon} height="100%" width="100%" />
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

              : sidebarContent.map((item) => (
                <ListItem
                  key={item.title}
                  p="1rem 1rem"
                  borderRadius="0.75rem"
                >
                  <Flex justify="start" align="center" gap="2rem" opacity="0.5">
                    <Box w="1.8rem" h="1.8rem">
                      <img src={item.icon} height="100%" width="100%" />
                    </Box>
                    <Text fontSize="1.6rem" color="blue.200" fontWeight={500}>
                      {item.title}
                    </Text>
                  </Flex>
                </ListItem>
              ))}

          </List>

        </Flex>
      </ModalContent>
    </Modal >
  )
}