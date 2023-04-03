import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import { SimpleGrid, Flex } from "@chakra-ui/react"
import Head from "next/head"
import { StudentEditForm } from "../../../components/student/StudentEditForm";
import { Header } from "../../../components/layout/Header";
import { Sidebar } from "../../../components/layout/Sidebar";

import { useRouter } from 'next/router';

interface PropType { }
const EditStudent: NextPage<PropType> = () => {
    const router = useRouter();
    const studentId = router.query.studentId;
    return (
        <SimpleGrid bg="#f9f9f9" minH="100vh"  >
            <Head>
                <title>Edit Student </title>
                <meta name="description" content="add student" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            {/* --- Content Wrapper --- */}
            <Flex flexDir="row" justifyContent="center" gap={["0px", "10px", "20px"]}  >
                <Sidebar />
                <StudentEditForm studentId={studentId} />
            </Flex>
            {/* --- End of Content Wrapper --- */}
        </SimpleGrid>
    );
}
export default EditStudent;