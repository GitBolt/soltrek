import { Flex, Text } from "@chakra-ui/react"
import { ConnectWalletButton } from "./ConnectWalletButton"

export const Navbar = () => {
    return (
        <Flex w="100%" h="6rem" pos="static" top="0" bg="bg.100" align="center" justify="end">
            <ConnectWalletButton />
        </Flex>
    )
}