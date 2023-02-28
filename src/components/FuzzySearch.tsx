import { useState, useRef, useEffect } from "react";
import {
  Input,
  Popover,
  List,
  PopoverContent,
  Grid,
  Flex,
  Button,
  ListItem,
  Divider,
  Text
} from "@chakra-ui/react";
import { useReactFlow } from "reactflow";
import { SidebarItemType } from "@/types/sidebar";
import { sidebarItems } from "@/util/sidebarItems";
import { createNodeId, createNodePos } from "@/util/randomData";


export const FuzzySearch = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [filteredItems, setFilteredItems] = useState<SidebarItemType[]>(sidebarItems);
  const [activeItem, setActiveItem] = useState<number>(-1)
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
      setIsOpen(true);
      inputRef.current?.focus();
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault()
      setIsOpen(false)
    }

    if (event.key === "Enter") {
      event.preventDefault()
      console.log(filteredItems)
      addNode(filteredItems[0].sub[0].type)
    }

  };

  const handleClickOutside = (e: any) => {
    if (!listRef.current || !e.target) return;

    // @ts-ignore
    if (!listRef.current.contains(e.target)) {
      setIsOpen(false);
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
    // Filter the items based on the search value
    if (searchValue.trim() === '') {
      setFilteredItems(sidebarItems);
      return;
    }

    setFilteredItems(
      sidebarItems
        .filter(item => item.title.toLowerCase().includes(searchValue.toLowerCase())
          || item.sub.some(sub => sub.title.toLowerCase().includes(searchValue.toLowerCase())))
        .map(item => ({
          ...item,
          sub: item.sub.filter(sub => sub.title.toLowerCase().includes(searchValue.toLowerCase()))
        }))
    );
  }, [searchValue]);


  return (
    <Popover isOpen={isOpen} initialFocusRef={inputRef}>
      <PopoverContent w="100vw" h="100vh" bg="#00000040">
        <Grid placeContent="center" h="100%" w="100%">
          <Flex
            ref={listRef}
            overflow="auto"
            bg="bg.400"
            h="40rem"
            w="40rem"
            flexFlow="column"
            align="center"
            p="1rem"
            borderRadius="1rem">
            <Input
              ref={inputRef}
              placeholder="Search..."
              value={searchValue}
              w="90%"
              mb="1rem"
              padding="1.5rem 1rem"
              fontSize="1.5rem"
              onChange={(event) => setSearchValue(event.target.value)}
            />

            <List w="90%">
              {filteredItems.map((item) => (
                <ListItem key={item.title}>
                  <Text
                    fontSize="1.6rem"
                    color="blue.200"
                    fontWeight={500}
                  >
                    {item.title}
                  </Text>

                  {item.sub.length && (
                    <List>
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
                            w="2rem"
                            borderColor="gray.100"
                            borderWidth="2px"
                            borderRadius="2rem" />
                          <ListItem w="100%" p="0 2rem 0 0">
                            <Button
                              variant="sidebar"
                              fontWeight="500"
                              color="blue.300"
                              bg={filteredItems[0].sub[0] == subItem && filteredItems != sidebarItems ? 'bg.300' : ''}
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
        </Grid>
      </PopoverContent>
    </Popover>
  )
}