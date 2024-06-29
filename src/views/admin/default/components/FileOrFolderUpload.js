import React, { useState } from 'react';
import { Button, VStack, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import axios from 'axios';

function FileOrFolderUpload() {
  const [inputType, setInputType] = useState('files'); // Default to file input
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);  // Convert to array to ensure compatibility
    setSelectedFiles(files);
    console.log(files.length, 'files or folders selected');
  };

  const handleRadioChange = (value) => {
    setInputType(value);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("No files or folders selected");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append(`image_${index}`, file, file.name);  // Ensure unique keys and proper file naming
    });

    try {
      const response = await axios.post("http://localhost:3100/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("Upload successful", response.data);
    } catch (error) {
      console.error("Upload error", error);
    }
  };

  const handleRunModel = async () => {
    try {
      const response = await axios.get("http://localhost:3100/run-model");
      console.log("Model run successful", response.data);
    } catch (error) {
      console.error("Model run error", error);
    }
  };

  return (
    <VStack spacing={4}>
      <RadioGroup onChange={handleRadioChange} value={inputType}>
        <Stack direction="row">
          <Radio value="files">Files</Radio>
          <Radio value="folder">Folder</Radio>
        </Stack>
      </RadioGroup>
      {inputType === 'files' ? (
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          style={{ display: 'none' }}
          id="file-input"
        />
      ) : (
        <input
          type="file"
          onChange={handleFileChange}
          webkitdirectory="true"
          directory="true"
          multiple  // Allow multiple files in case of folder selection
          style={{ display: 'none' }}
          id="folder-input"
        />
      )}
      <Button onClick={() => document.getElementById(inputType === 'files' ? 'file-input' : 'folder-input').click()} colorScheme="gray">
        Select {inputType === 'files' ? 'Files' : 'Folder'}
      </Button>
      <Button colorScheme="blue" onClick={handleUpload}>Upload</Button>
      <Button colorScheme="green" onClick={handleRunModel}>Run Model</Button>
    </VStack>
  );
}

export default FileOrFolderUpload;

// import {
//   Box,
//   Button,
//   Flex,
//   Icon,
//   Text,
//   useColorModeValue,
//   VStack,
//   useBreakpointValue
// } from "@chakra-ui/react";
// import Card from "components/card/Card.js";
// import React, { useState } from "react";
// import { MdUpload } from "react-icons/md";
// import Dropzone from "views/admin/profile/components/Dropzone";
// import axios from 'axios';

// export default function FileOrFolderUpload(props) {
//   const { ...rest } = props;
//   const [file, setFile] = useState(null);

//   // Chakra Color Mode
//   const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
//   const brandColor = useColorModeValue("brand.500", "white");
//   const textColorSecondary = useColorModeValue("gray.400", "gray.200");

//   // Responsive design adjustments
//   const flexDirection = useBreakpointValue({ base: "column", md: "row" });

//   const handleFileChange = (acceptedFiles) => {
//     setFile(acceptedFiles[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert("No file selected");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       const response = await axios.post("http://localhost:3100/upload", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data"
//         }
//       });
//       console.log("Upload successful", response.data);
//     } catch (error) {
//       console.error("Upload error", error);
//     }
//   };

//   return (
//     <Card {...rest} mb="20px" p="20px">
//       <Flex direction={flexDirection} align="center" justify="space-between">
//         <VStack spacing={4} align="center" flex="1">
//           <Dropzone onDrop={handleFileChange} content={
//             <Box textAlign="center">
//               <Icon as={MdUpload} w="80px" h="80px" color={brandColor} mb="4" />
//               <Text fontSize="xl" fontWeight="700" color={brandColor}>
//                 Upload Files
//               </Text>
//               <Text fontSize="sm" color={textColorSecondary}>
//                 PNG, JPG, and GIF files are allowed
//               </Text>
//             </Box>
//           }/>
//         </VStack>
//         <VStack spacing={4} flex="1" ml={{ md: 8 }}>
//           <Text color={textColorPrimary} fontWeight="bold" fontSize="2xl">
//             Analyze Images
//           </Text>
//           <Text color={textColorSecondary} fontSize="md">
//             Upload the images that you wish to analyze for compliance rate.
//           </Text>
//           <Button colorScheme="blue" size="lg" onClick={handleUpload}>
//             Upload
//           </Button>
//         </VStack>
//       </Flex>
//     </Card>
//   );
// }