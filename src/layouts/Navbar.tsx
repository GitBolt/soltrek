import { Flex, Text } from "@chakra-ui/react"
import { ConnectWalletButton } from "../components/ConnectWalletButton"
import { NetworkSelector } from "../components/NetworkSelector"

export const Navbar = () => {
    return (
        <Flex w="100%" h="6rem" pos="static" top="0" bg="bg.100" align="center" justify="end">
            <NetworkSelector />
            <ConnectWalletButton />
        </Flex>
    )
}