import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from "next/router";
import 'react-toastify/dist/ReactToastify.css';
import React, { ChangeEvent, useState, useEffect } from "react";
import { Box, Flex, FormControl, FormLabel, Input, Button, Text } from "@chakra-ui/react";
import axios from "axios";
import { NextPage } from "next";
import { baseURL } from "../../utils/axios";
import { useForm } from "react-hook-form";

interface formDataType {
    name: String,
    email: String
}
interface PropType { }
export const StudentAddForm: NextPage<PropType> = () => {
    const [uploading, setUploading] = useState<boolean>(false);
    const [preview, setPreview] = useState();
    const [file, setFile] = useState<File>();
    const router = useRouter();

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };


    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async ({ name, email }: formDataType | any) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        file ? formData.append('image', file) : ""

        await axios.post(`${baseURL}student_add`, formData).then((res) => {
            if (res.status == 200) {
                toastify('Student Inserted Successfully');
                // after 3 second should navigate to home page
                let timer = setTimeout(() => { router.push('/'); }, 3000);
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
            setPreview(undefined)
            return
        }
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [file])

    return (
        <>
            <Box>
                <Text pl={5} pt={5} fontSize={20} fontWeight="bold">Guide: </Text>
                <Text pl={5}>1. Upload image on the right side 👉 to crop.</Text>
                <Text pl={5}>2. Use the arrow keys on the keyboard to increase and decrease (rotate and scale) amount. </Text>
                <Text pl={5}>3. Check the toggle aspect button for custom cropping.</Text>
                <Text pl={5}>4. Crop the image and download.</Text>
                <Text pl={5}>5. Upload the cropped image 👇 and submit the form.</Text>
                <Flex p="30px" gap="20px" >

                    <Box w={["50%"]}>
                        {/* ---------------- Insertion Form ------------- */}
                        <form>
                            {/* User Name */}
                            <FormControl>
                                <FormLabel>User Name </FormLabel>
                                <Input placeholder="user name"
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
                                    <span>Upload Image</span>
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

function toastify(msg = "inserted") {
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
