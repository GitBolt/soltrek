import { SavedPlaygroundType } from "@/types/playground"
import { Button, Input, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useState } from "react"
import { useReactFlow } from "reactflow"

type Props = {
  handlePlaygroundSave: () => void,
  savedPg: any,
}
export const LoadSave = ({
  handlePlaygroundSave,
  savedPg,
}: Props) => {

  const { toObject, setNodes, setEdges, setViewport } = useReactFlow()

  const exportJson = () => {
    const data = JSON.stringify(toObject())
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "playground.json";
    link.click();
    URL.revokeObjectURL(url);
  }


  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const fileContent = e.target.result;
      try {
        const jsonData = JSON.parse(fileContent);
        setNodes(jsonData.nodes || [])
        setEdges(jsonData.edges || [])
        setViewport(jsonData.viewport || [])
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };
    reader.readAsText(file);
  };


  return (
    <>

      <Menu placement="bottom-end">
        <MenuButton
          as={Button}
          variant="filled" h="3rem" fontSize="1.7rem" w="8rem"
        >
          Save
        </MenuButton>
        <MenuList
          w="8rem"
          bg="blue.100"
          p="1rem 1rem"
          borderRadius="0.7rem"
          boxShadow="0px 0px 10px #00000070"
        >
          <MenuItem
            fontSize="1.5rem"
            as={Button}
            w="100%"
            bg="blue.200"
            color="white"
            h="3.5rem"
            transition="300ms"
            _hover={{ filter: "brightness(120%)", bg: "blue.100" }}
            onClick={handlePlaygroundSave}
          >
            To Account
          </MenuItem>

          <MenuItem
            fontSize="1.5rem"
            as={Button}
            w="100%"
            mt="1rem"
            bg="blue.200"
            color="white"
            h="3.5rem"
            transition="300ms"
            _hover={{ filter: "brightness(120%)", bg: "blue.100" }}
            onClick={exportJson}
          >
            Export File
          </MenuItem>

        </MenuList>
      </Menu>


      <Menu placement="bottom-end">
        <MenuButton
          as={Button}
          variant="outline" h="3rem" fontSize="1.7rem" w="8rem"
        >
          Load
        </MenuButton>
        <MenuList
          w="8rem"
          bg="bg.100"
          p="1rem 1rem"
          borderRadius="0.7rem"
          boxShadow="0px 0px 10px #00000070"
        >
          <MenuItem
            fontSize="1.5rem"
            as={Button}
            w="100%"
            bg="none"
            border="1px solid"
            borderColor="blue.200"
            color="blue.200"
            h="3.5rem"
            transition="300ms"
            _hover={{ filter: "brightness(120%)", bg: "bg.200" }}
            onClick={savedPg.onOpen}
          >
            From Account
          </MenuItem>

          <MenuItem mt="1rem" fontWeight={600} fontSize="1.5rem" as="label" htmlFor="file-input" w="100%" bg="none" border="1px solid" borderColor="blue.200" color="blue.200" h="3.5rem" transition="300ms" _hover={{ filter: "brightness(120%)", bg: "bg.200" }}>
            Import File
            <input id="file-input" type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileChange} />
          </MenuItem>
        </MenuList>
      </Menu>

    </>
  )
}