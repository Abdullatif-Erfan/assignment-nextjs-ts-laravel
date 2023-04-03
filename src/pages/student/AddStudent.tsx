import { NextPage } from "next";
import { SimpleGrid, Flex, Box } from "@chakra-ui/react"
import Head from "next/head"
import { Header } from "../../components/layout/Header";
import { Sidebar } from "../../components/layout/Sidebar"
import { StudentAddForm } from "../../components/student/StudentAddForm";
import { ImageCropper } from "../../components/image-cropper/ImageCropper";


interface PropType { }
const AddStudent: NextPage<PropType> = () => {
    return (
        <SimpleGrid bg="#f9f9f9" minH="100vh"  >
            <Head>
                <title>Add Student Page</title>
                <meta name="description" content="add student" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            {/* --- Content Wrapper --- */}
            <Flex flexDir="row" justifyContent="center" gap={["0px", "10px", "20px"]}  >
                <Sidebar />

                {/* col-xs-1  col-sm-1 col-md-2 col-lg-2 */}
                <SimpleGrid
                    columns={{ base: 1, sm: 1, md: 2, lg: 2 }}
                    boxShadow="0px 0px 10px #ddd"
                    px={10}
                    py={4}
                    my={4}
                    mx={4}
                    spacingX="10px"
                    spacingY="20px"
                    w="100%"
                >
                    <Box>
                        <StudentAddForm />
                    </Box>
                    <Box bg="#f6f6f6" borderLeft="1px" borderColor="#ddd">
                        <ImageCropper />
                    </Box>
                </SimpleGrid>
            </Flex>
            {/* --- End of Content Wrapper --- */}
        </SimpleGrid>
    );
}
export default AddStudent;