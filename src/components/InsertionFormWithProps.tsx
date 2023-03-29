import React, { useState } from "react";
import formidable from "formidable";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormHelperText,
  FormErrorMessage,
  Container,
} from "@chakra-ui/react";
import axios from "axios";
import path from "path";
import fs from "fs/promises";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

interface propType {
  dirs: string[];
}
const InsertionForm: NextPage<propType> = ({ dirs }) => {
  const [fullName, setFullName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>();

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setFullName((e.target as HTMLInputElement).value);
  };
  const isError = fullName === "";

  //   const handleFileUpload = (e: React.FormEvent<HTMLInputElement>): void => {
  //       const imageFile = (e.target as HTMLInputElement).files;
  //     console.log(imageFile);
  //     setSelectedImage(imageFile[0]);
  //   };
  const handleFileUpload = (e: any) => {
    console.log(e.target.files);
    setSelectedImage(e.target.files[0]);
  };
  const onSubmit = () => {
    alert(fullName);
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append("photo", selectedFile);
      const { data } = await axios.post("/api/image", formData);
      console.log("-----", data.done);
      console.log();
    } catch (error) {
      console.log(error.response?.data);
    }
    setUploading(false);
  };
  return (
    <Flex
      mb="20px"
      ml="60px"
      mt="20px"
      mr="60px"
      w="100%"
      p="30px"
      justifyContent="space-between"
      gap="20px"
    >
      <form onSubmit={onSubmit}>
        {/* Full Name */}
        <Box w={["100%"]} borderColor="red">
          {/* <FormControl isInvalid={isError}>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={fullName} onChange={handleInputChange} />
            {isError && <FormErrorMessage>Email is required.</FormErrorMessage>}
          </FormControl> */}
          <FormControl>
            <FormLabel>Full Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter full name"
              value={fullName}
              onChange={handleInputChange}
            />
          </FormControl>
        </Box>
        {/*  End of Full Name  */}

        {/* photo */}
        <Box w={["100%"]} borderColor="red">
          {/* <FormControl isInvalid={isError}>
            <FormLabel>Photo</FormLabel>
            <Input type="file" value={fullName} onChange={handleInputChange} />
            {isError && <FormErrorMessage>Photo is required.</FormErrorMessage>}
          </FormControl> */}
          {/* <FormControl>
            <FormLabel>Photo</FormLabel>
            <Input type="file" name="file" onChange={handleFileUpload} />
          </FormControl> */}
          <input
            type="file"
            onChange={({ target }) => {
              if (target.files) {
                const file = target.files[0];
                setSelectedImage(URL.createObjectURL(file));
                setSelectedFile(file);
              }
            }}
          />
          <Flex
            w="200px"
            h="200px"
            bg="gray.500"
            alignItems="center"
            justifyContent="center"
          >
            {selectedImage ? (
              <img src={selectedImage} alt="" />
            ) : (
              <span style={{ color: "white" }}>Upload Image</span>
            )}
          </Flex>
        </Box>
        {/* End of Photo */}

        {/* submit button */}
        <FormControl>
          <Button
            onClick={handleUpload}
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

      {/*  ---- show uploaded image name ---  */}
      <Box bg="red">
        {dirs.map((item) => (
          <Link key={item} href={"/images/" + item}>
            <a href="#">{item}</a>
          </Link>
        ))}
      </Box>
    </Flex>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const props = { dirs: [] };
  try {
    const dirs = await fs.readdir(path.join(process.cwd(), "/public/images"));
    props.dirs = dirs as any;
    return { props };
  } catch (error) {
    return { props };
  }
};

export default InsertionForm;
