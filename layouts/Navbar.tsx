import { Flex, Text } from "@chakra-ui/react"
import { ConnectWalletButton } from "./ConnectWalletButton"

export const Navbar = () => {
    return (
        <Flex bg="white" w="100%" h="6rem" pos="static" top="0" zIndex="10" align="center" justify="center">
            <Text>I am marry poppings yall</Text>
            <ConnectWalletButton />
        </Flex>
    )
}