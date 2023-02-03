import type { NextPage } from 'next';
import Playground from '@/layout/Playground';
import { Flex } from '@chakra-ui/react'
import Sidebar from '@/components/Sidebar';

const Home: NextPage = () => {
  return (
    <>
      <Flex flexFlow="column" h="100%">
        <Sidebar />
        <Playground />
      </Flex>
    </>
  );
};

export default Home;
