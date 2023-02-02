import type { NextPage } from 'next';
import Playground from '@/layout/Playground';
import { Flex } from '@chakra-ui/react'

const Home: NextPage = () => {
  return (
    <>
      <Flex flexFlow="column" h="100%">
        <Playground />
      </Flex>
    </>
  );
};

export default Home;
