import Head from "next/head";
import { Flex, SimpleGrid } from "@chakra-ui/react";
import { NextPage } from "next";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { StudentList } from "../components/student/StudentList";

interface propType { }
const Home: NextPage<propType> = () => {
  return (
    <SimpleGrid bg="#f9f9f9" minH="100vh">
      <Head>
        <title>Index Page</title>
        <meta name="description" content="Keywords about this page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {/* Content  */}
      <Flex flexDir="row" justifyContent="center" gap={["0px", "10px", "20px"]} >
        <Sidebar />
        <StudentList />
      </Flex>
      {/* End of Content */}
    </SimpleGrid>

  );
}
export default Home;