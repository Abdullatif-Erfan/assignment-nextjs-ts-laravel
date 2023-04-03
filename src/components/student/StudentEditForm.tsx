import NextLink from "next/link"
import style from "../../styles/dashboard.module.css"
import { FaPlus, FaBackward, FaArrowCircleLeft } from "react-icons/fa"
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from "next/router";
import 'react-toastify/dist/ReactToastify.css';
import React, { ChangeEvent, useState, useEffect } from "react";
import { Box, Flex, FormControl, FormLabel, Input, Button, Text, Divider } from "@chakra-ui/react";
import { NextPage } from "next";
import { axiosInstanceWithJsonType, baseURL } from "../../utils/axios";
import axios from "axios";
import { useForm } from "react-hook-form";

interface formDataType {
    name: String,
    email: String
}

interface PropType { studentId: number }
export const StudentEditForm: NextPage<PropType> = ({ studentId }: { studentId: number }) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    const [uploading, setUploading] = useState<boolean>(false);
    const [preview, setPreview] = useState();
    const [file, setFile] = useState<File>();
    const router = useRouter();


    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await axiosInstanceWithJsonType.get(`student_by_id/${studentId}`);
                setData(result.data);
                setValue('name', data ?.name);
                setValue('email', data ?.email);
            } catch (err) {
                console.error(err.message);
            }
            setLoading(false);
        }
        fetchData();
    }, []);



    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const onSubmit = async ({ name, email }: formDataType | any) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        file ? formData.append('image', file) : ""

        await axios.post(`${baseURL}student_update/${studentId}`, formData).then((res) => {
            if (res.status == 200) {
                toastify('Record Updated Successfully');
                // after 2 second should navigate to home page
                let timer = setTimeout(() => { router.push('/'); }, 2000);
                return () => { clearTimeout(timer); }
            }
        }).catch((err) => {
            console.log('Error Posting the form', err);
        })
        // setUploading(false);
    };

    /** ------------- Preview image before upload ---------- */
    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!file) {
            // setPreview(undefined)
            return
        }
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [file])

    return (
        <>
            <Box bg="#fff" w="100%" mx="20px" my="20px" boxShadow="0px 0px 7px -2px #00000042" borderRadius="3px">
                <Flex justifyContent="space-between" m="10px">
                    <NextLink href="/">
                        <Button className={style.insertButton} ><FaArrowCircleLeft /></Button>
                    </NextLink>
                    <Text fontSize="lg" >Edit Form </Text>
                </Flex>
                <Divider />

                {/* Form */}
                <Flex mb="20px" ml="60px" mt="20px" mr="60px" p="30px"
                    gap="20px" borderBottom="2px solid green">
                    <Box w={["50%"]}>
                        {/* ---------------- Insertion Form ------------- */}
                        {
                            loading ? <h1>Loading....</h1> :
                                <form>
                                    {/* User Name */}
                                    <FormControl>
                                        <FormLabel>User Name </FormLabel>
                                        <Input placeholder="user name"
                                            defaultValue={data ?.name}
                                            {...register("name", {
                                                required: { value: true, message: "Name is required" }
                                            })}
                                        />
                                        {errors.name && <Text color="red">{errors.name.message}</Text>}
                                    </FormControl>
                                    {/*  End of User Name  */}

                                    {/* Email */}
                                    <FormControl>
                                        <FormLabel>Email </FormLabel>
                                        <Input
                                            placeholder="Email"
                                            defaultValue={data ?.email}
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                                    message: 'Please enter a valid email',
                                                },
                                            })}
                                            type="email"
                                            required
                                            className="input"
                                        />
                                        {errors.email && <Text color="red">{errors.email.message}</Text>}
                                    </FormControl>
                                    {/*  End of Email  */}

                                    {/* photo */}
                                    <FormControl>
                                        <FormLabel>User Photo</FormLabel>
                                        <Input type="file" onChange={handleFileUpload}
                                        />
                                    </FormControl>


                                    <FormControl>
                                        <Button
                                            onClick={handleSubmit(onSubmit)}
                                            disabled={uploading}
                                            style={{ opacity: uploading ? ".5" : "1" }}
                                            colorScheme="teal"
                                            type="submit"
                                            mt="30px"
                                        >
                                            {uploading ? "Uploading..." : "Submit"}
                                        </Button>
                                    </FormControl>
                                    {/* End of Submit button */}

                                </form>
                        }
                        {/* ---------------- End of Insertion Form ------------- */}
                    </Box>


                    {/* ---------------- Preview Image ------------- */}
                    <Box w={["50%"]} >
                        <Flex
                            w="200px"
                            h="200px"
                            bg="gray.100"
                            border="2px dotted #ddd"
                            alignItems="center"
                            justifyContent="center"
                            mt="30px"
                        >
                            {preview ? (
                                <img src={preview} alt="" />
                            ) : (
                                    <img src={`${baseURL}images/${data ?.image}`} alt="" />
                                )}
                        </Flex>

                    </Box>
                    {/* ----------------  End of Preview Image ------------- */}
                </Flex>
                {/* End Form */}
                <ToastContainer />
            </Box>
        </>
    );
}

function toastify(msg = "updated") {
    toast.success(msg, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}
