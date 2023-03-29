import React, { useState } from "react";
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
import { NextPage } from "next";

interface propType {}
const InsertionForm: NextPage<propType> = () => {
  const [fullName, setFullName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>();

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setFullName((e.target as HTMLInputElement).value);
  };
  //   const isError = fullName === "";

  //   const handleFileUpload = (e: React.FormEvent<HTMLInputElement>): void => {
  //       const imageFile = (e.target as HTMLInputElement).files;
  //     console.log(imageFile);
  //     setSelectedImage(imageFile[0]);
  //   };
  //   const handleFileUpload = (e: any) => {
  //     console.log(e.target.files);
  //     setSelectedImage(e.target.files[0]);
  //   };
  //   const onSubmit = () => {
  //     alert(fullName);
  //   };

  /**
   * Upload Image and save into public/images directory
   */
  const handleUploadLocally = async () => {
    setUploading(true);
    try {
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append("photo", selectedFile);
      const { data } = await axios.post("/api/uploadImage", formData);
      //   console.log("-----", data.done);
      //   console.log(selectedFile.name);
      /**
       *  image is uploaded and saved locally, now update the backend
       */
      if (data.done) {
        sendFormDataToBackend(selectedFile.name);
      }
    } catch (error) {
      console.log(error.response?.data);
    }
    setUploading(false);
  };

  /**
   * send form data to the backend
   */
  const sendFormDataToBackend = async (fileName: string) => {
    // console.log(fileName);
    // console.log(fullName);
    const submitResult = await axios.post("http://localhost:5000/createUser", {
      fullName,
      fileName,
    });
    console.log(submitResult.data);
    //  await axios.post("http://localhost:5000/createUser", {
    //     fullName,
    //     fileName,
    //   })
    // .then(response => userData({ response.data, {...data} }))
    //     .catch(error => {
    //     setError(error.message);
    //         console.error('There was an error!', error);
    //     });
  };
  return (
     
     <Flex mb="20px" ml="60px" mt="20px" mr="60px" p="30px"
    gap="20px" borderBottom="2px solid green">

     {/* ---------------- Left Side ------------- */}
     <Box w={["50%"]}>
        
        {/* Full Name */}
        <FormControl>
          <FormLabel>Full Name</FormLabel>
          <Input
            type="text"
            placeholder="Enter full name"
            value={fullName}
            onChange={handleInputChange}
          />
        </FormControl>
      {/*  End of Full Name  */}

      {/* photo */}
      <Box mt="10px">
      <FormControl>
        <FormLabel>User Photo</FormLabel>
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
        </FormControl>
      </Box>
      {/* End of Photo */}

      {/* submit button */}
      <FormControl>
        <Button
          onClick={handleUploadLocally}
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

     </Box>
     {/* ---------------- Left Side ------------- */}


     {/* ---------------- Right Side ------------- */}
     <Box w={["50%"]} >
     <Flex
          w="200px"
          h="200px"
          bg="gray.100"
          border="2px dotted #ddd"
          alignItems="center"
          justifyContent="center"
        >
          {selectedImage ? (
            <img src={selectedImage} alt="" />
          ) : (
            <span>Upload Image</span>
          )}
        </Flex>
        
     </Box>
     {/* ----------------  End Right Side ------------- */}


      
    </Flex>
  );
};

export default InsertionForm;
