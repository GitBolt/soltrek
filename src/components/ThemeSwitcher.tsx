/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Box, Flex, Text, Divider, useColorMode } from '@chakra-ui/react';
import { useCustomTheme } from '@/context/themeContext';
import { themeHighContrast } from '@/util/themeHighContrast';
import { themeDark } from '@/util/themeDark';

export const ThemeSwitcher = () => {

  const { setTheme, theme } = useCustomTheme()

  const handleHighContrast = () => {
    const elem = document.querySelector(".react-flow") as HTMLElement
    if (elem) {
      elem.style.background = themeHighContrast.colors.bg["100"] || "black"
    }
    setTheme("high_contrast")
    localStorage.setItem("theme", "high_contrast")
  }

  const handleDefaultDark = () => {
    const elem = document.querySelector(".react-flow") as HTMLElement
    if (elem) {
      elem.style.background = themeDark.colors.bg["100"] || "black"
    }
    setTheme("default_dark")
    localStorage.setItem("theme", "default_dark")
  }

  return (
    <Flex bg="bg.200" flexFlow="column" p="1rem 3rem">
      <Text color="magenta.100" fontSize="1.8rem">Theme</Text>
      <Divider my="1rem" borderColor="gray.200" />
      <Flex justify="space-between">
        <Box
          w="10rem"
          h="8rem"
          overflow="hidden"
          cursor="pointer"
          onClick={handleDefaultDark}
          border="1px solid"
          borderColor={theme == "default_dark" ? "magenta.100" : "gray.100"}
          borderRadius="0.5rem"
        >
          <Text p="0.4rem"
            fontSize="1.2rem" mb="5px" color="blue.100" fontWeight={800}>Dark</Text>
          <Box h="100%" bg="dark" overflow="hidden">
            <img src="/assets/dark.png" width="100%" height="100%" alt="Preview" style={{ objectFit: "cover", overflow: "hidden" }} />
          </Box>
        </Box>

        <Box
          w="10rem"
          h="8rem"
          overflow="hidden"
          cursor="pointer"
          onClick={handleHighContrast}
          border="1px solid"
          borderColor={theme == "high_contrast" ? "magenta.100" : "gray.100"}
          borderRadius="0.5rem"
        >
          <Text p="0.4rem" fontSize="1.2rem" mb="5px" color="blue.100" fontWeight={800}>High Contrast</Text>
          <Box h="100%" bg="dark" overflow="hidden">
            <img src="/assets/highContrast.png" width="100%" height="100%" alt="Preview" style={{ objectFit: "cover", overflow: "hidden" }} />
          </Box>
        </Box>
      </Flex>

    </Flex>
  );
};

