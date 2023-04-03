import { NextPage } from "next";
import Link from "next/link";
import { Box, Flex, Text, Button, Divider } from "@chakra-ui/react";
import style from "../../styles/dashboard.module.css";
import { FaPlus, FaPencilAlt, FaTrash } from "react-icons/fa";
import NextLink from "next/link";
import React, { useState, useEffect } from "react";
import Spinner from "../../components/spinner/Spinner";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface studentListTypes {
    id: number,
    name: string,
    email: String,
    image: String,
    created_at: string,
    updated_at: string
}
import { baseURL, axiosInstanceWithJsonType } from "../../utils/axios";

export const StudentList: NextPage<{}> = () => {

    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const result = await axiosInstanceWithJsonType.get('student_list');
            setData(result.data);
        }
        fetchData();
    }, []);


    /** ============== delete a student  =================== */
    const deleteRecord = async (id: number) => {
        var conf = confirm('Do you want to delete ?');
        if (conf) {
            try {
                const result = await axiosInstanceWithJsonType.get(`student_delete/${id}`);
                if (Number(result.status) === 200) {
                    const remainingResults = data.filter((result) => result.id !== id)
                    setData(remainingResults);
                    toastify('Record deleted successfully');
                } else {
                    toastify('Error in deletion');
                }
            } catch (e) {
                toastify(`Error in deletion, ${e.message}`);
            }
        }
    }

    return (
        <>
            <Box bg="#fff" w="100%" mx="20px" my="20px" boxShadow="0px 0px 7px -2px #00000042" borderRadius="3px">
                <Flex justifyContent="space-between" m="10px">
                    <Text fontSize="lg" >Student List</Text>
                    <NextLink href="/student/AddStudent"><Button className={style.insertButton} > <FaPlus /> &nbsp;
                    Insert New Record</Button></NextLink>
                </Flex>
                <Divider />

                {/* Table */}
                <Box m="20px">
                    {
                        data.length === 0 ? (<Spinner />) :
                            <>
                                <table className={style.studentTable} >
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Image</th>
                                            <th>Edit</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data ?.map(({ id, name, email, image, created_at, updated_at }: studentListTypes) => (
                                                <tr key={id}>
                                                    <td>{id}</td>
                                                    <td>{name}</td>
                                                    <td>{email}</td>
                                                    <td>
                                                        <img width="40px" src={`${baseURL}images/${image}`} alt="" /></td>
                                                    <td>
                                                        <center>
                                                            <Link href={`/student/edit/${id}`}><Button h="30" w="30"><FaPencilAlt fontSize="12px" /></Button></Link>
                                                        </center>
                                                    </td>
                                                    <td>
                                                        <center>
                                                            <Button onClick={() => deleteRecord(id)} backgroundColor="#f5acac" h="30" w="30"><FaTrash fontSize="12px" color="#fff" /></Button>
                                                        </center>
                                                    </td>
                                                </tr>
                                            ))
                                        }

                                    </tbody>
                                </table>
                            </>
                    }
                </Box>
                {/* End Table */}
                <ToastContainer />
            </Box>
        </>
    )
}

function toastify(msg: string) {
    toast.success(msg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}
