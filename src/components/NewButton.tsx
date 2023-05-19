/* eslint-disable @next/next/no-img-element */
// Components
import React from 'react';

// Layouts
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useToast,
} from '@chakra-ui/react';

// Icons
import { AddIcon } from '@chakra-ui/icons';

// Util
import { useRouter } from 'next/router';

type Props = {
  user: any,
  setCurrentPlayground: React.Dispatch<React.SetStateAction<any>>
  setViewport: React.Dispatch<React.SetStateAction<any>>
  setEdges: React.Dispatch<React.SetStateAction<any>>
  setNodes: React.Dispatch<React.SetStateAction<any>>
}

export const NewButton = ({ user, setCurrentPlayground, setNodes, setViewport, setEdges }: Props) => {
  const router = useRouter()
  const toast = useToast()

  const startMultiplayer = async () => {
    toast({
      status: "loading",
      title: "Spinning up a new playground"
    })
    const response = await fetch('/api/playground/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        name: "Untitled",
        data: "",
        preview_uri: "",
      }),
    })
    const data = await response.json()
    if (response.ok) {
      window.open(`/playground/${data.id}`, '_ blank')
      // router.push(, "")
      console.log("New Pg Data: ", data)
      setCurrentPlayground(data)
      toast.closeAll()
    }
  }


  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={Button}
        w="7rem"
        h="3rem"
        variant="magenta"
        leftIcon={<AddIcon w="1.2rem" h="1.2rem" />}
      >
        New
      </MenuButton>
      <MenuList
        w="12rem"
        p="0.5rem"
        bg="#1e1c28"
        borderRadius="0.7rem"
        borderColor="gray.200"
        border="1px solid"
        boxShadow="0px 0px 10px #00000070"
      >
        <MenuItem
          bg="#1e1c28"
          color="#ec307f"
          fontSize="1.5rem"
          borderBottom={user ? "1px solid" : "none"}
          borderColor="gray.200"
          h="4rem"
          transition="300ms"
          _hover={{ filter: "brightness(130%)" }}
          onClick={() => {
            setCurrentPlayground(undefined);
            setNodes([]);
            setEdges([]);
            setViewport({ x: 0, y: 0, zoom: 1.5 });
            router.push("/");
          }}
        >
          Single Player
        </MenuItem>
        {user && (
          <MenuItem
            bg="#1e1c28"
            color="#ec307f"
            fontSize="1.5rem"
            transition="300ms"
            h="4rem"
            _hover={{ filter: "brightness(130%)" }}
            onClick={startMultiplayer}
          >
            Multiplayer
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};
