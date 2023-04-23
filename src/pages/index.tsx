import type { NextPage } from "next";
import Playground from "@/layouts/Playground";
import { Flex } from "@chakra-ui/react";
import Sidebar from "@/layouts/Sidebar";
import { sidebarContent } from "@/util/sidebarContent";
import { CommandPalette } from "@/components/CommandPalette";
import { Navbar } from "@/layouts/Navbar";

const Home: NextPage = () => {
  return (
    <>
      <Flex flexFlow="column" h="100%">
        <Navbar />
        <Sidebar sidebarContent={sidebarContent} />
        <CommandPalette />
        <Playground />
      </Flex>
    </>
  );
};

export default Home;
