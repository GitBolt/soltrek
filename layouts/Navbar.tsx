import { Flex, Text } from "@chakra-ui/react"
import { ConnectWalletButton } from "./ConnectWalletButton"

export const Navbar = () => {
    return (
        <Flex bg="white" w="100%" h="6rem">
            <Text>I am marry poppings yall</Text>
            <ConnectWalletButton />
        </Flex>
    )
}