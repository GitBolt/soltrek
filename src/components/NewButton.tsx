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

  const startMultiplayer = async () => {

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

    if (response.ok) {
      const data = await response.json()
      router.push(`/playground/${data.id}`)
    }
  }


  return (
    <Menu>
      <MenuButton
        as={Button}
        w="7rem"
        h="3rem"
        fontSize="1.5rem"
        borderRadius="0.5rem"
        variant="filled"
        color="white"
        bg="magenta.100"
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
      >
        <MenuItem
          bg="#1e1c28"
          color="#ec307f"
          fontSize="1.5rem"
          h="4rem"
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
            h="4rem"
            onClick={startMultiplayer}
          >
            Multiplayer
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};
