import type { NextPage } from "next";
import Playground from "@/layout/Playground";
import { Flex } from "@chakra-ui/react";
import Sidebar from "@/components/Sidebar";
import { sidebarContent } from "@/util/sidebarContent";
import { FuzzySearch } from "@/components/FuzzySearch";
import { Navbar } from "layouts/Navbar";

const Home: NextPage = () => {
  return (
    <>
      <Flex flexFlow="column" h="100%">
        <Navbar />
        <Sidebar sidebarContent={sidebarContent} />
        <FuzzySearch />
        <Playground />
      </Flex>
    </>
  );
};

export default Home;
