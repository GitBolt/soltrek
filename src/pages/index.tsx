import type { NextPage } from 'next';
import Playground from '@/layout/Playground';
import { Flex } from '@chakra-ui/react'
import Sidebar from '@/components/Sidebar';
import { sidebarItems } from '@/util/sidebarItems';

const Home: NextPage = () => {
  return (
    <>
      <Flex flexFlow="column" h="100%">
        <Sidebar sidebarItems={sidebarItems} />
        <Playground />
      </Flex>
    </>
  );
};

export default Home;
