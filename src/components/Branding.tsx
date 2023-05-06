/* eslint-disable @next/next/no-img-element */
import { Flex, Text, Box, LinkBox } from "@chakra-ui/react"
import Link from "next/link"

const Branding = () => {
  return (
    <Link href="/">
      <LinkBox gap="1rem" h="6rem" sx={{ justifyContent: "center", display: "flex", align: "center" }}>
        <Box w="5rem">
          <img src="/logo.png" width="100%" height="100%" alt="logo" />
        </Box>
        <Text fontSize="1.8rem" fontWeight={600} color="magenta.300">SOL Trek</Text>
      </LinkBox>
    </Link>
  )
}

export default Branding