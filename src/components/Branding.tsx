/* eslint-disable @next/next/no-img-element */
import { Flex, Text, Box } from "@chakra-ui/react"

const Branding = () => {
  return (
    <Flex gap="1rem" h="6rem" justify="center" align="center">
      <Box w="5rem">
        <img src="/logo.png" width="100%" height="100%" alt="logo" />
      </Box>
      <Text fontSize="1.8rem" fontWeight={600} color="magenta.300">SOL Trek</Text>
    </Flex>
  )
}

export default Branding