import { useState, useRef } from 'react';
import {
  Popover,
  PopoverContent,
  Grid,
  Flex,
  Input,
  Box,
  Icon,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { SidebarContentType, ItemType, SubItemType } from '@/types/sidebar';

export const FuzzySearch = ({ content }: { content: SidebarContentType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setSearchValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (!content) return
  const filteredItems = content.items?.filter((item) => {
    const itemTitle = item.title.toLowerCase();
    const subItemTitles = item.sub?.map((subItem) => subItem.title.toLowerCase()) || [];
    return (
      itemTitle.includes(searchValue.toLowerCase()) ||
      subItemTitles.some((subItemTitle) => subItemTitle.includes(searchValue.toLowerCase()))
    );
  }) || [];

  return (
    <Popover isOpen={isOpen} onOpen={handleToggle} onClose={handleToggle} initialFocusRef={inputRef}>
      <PopoverContent w="100vw" h="100vh" bg="#00000040">
        <Grid placeContent="center" h="100%" w="100%">
          <Flex
            overflow="auto"
            bg="bg.400"
            h="40rem"
            w="40rem"
            flexFlow="column"
            align="center"
            p="1rem"
            borderRadius="1rem"
          >
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
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <Box key={item.title} w="100%" mb="1rem">
                  <Flex align="center" cursor="pointer">
                    <Icon as={content.icon} w="1.5rem" h="1.5rem" mr="0.5rem" />
                    <Box>{item.title}</Box>
                  </Flex>
                  {item.sub?.map((subItem) => (
                    <Box key={subItem.title} pl="1rem">
                      <Flex align="center" cursor="pointer">
                        <Icon w="1.5rem" h="1.5rem" mr="0.5rem" />
                        <Box>{subItem.title}</Box>
                      </Flex>
                    </Box>
                  ))}
                </Box>
              ))
            ) : (
              <Box>No results found.</Box>
            )}
          </Flex>
        </Grid>
      </PopoverContent>
    </Popover>
  );
};
