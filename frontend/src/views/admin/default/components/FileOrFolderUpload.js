import React, { useState, useContext } from 'react';
import { Button, VStack, Radio, RadioGroup, Stack, Spinner, Image, Text } from '@chakra-ui/react';
import axios from 'axios';
import { ImageContext } from '../../../../ImageContext.js';

function FileOrFolderUpload() {
  const [inputType, setInputType] = useState('files'); // Default to file input
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading indicator
  const { setPlotImages, setOverallPercentage, setCompliancePercentage } = useContext(ImageContext);

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

    setLoading(true);
    const startTime = Date.now();

    try {
      await axios.post("http://localhost:3100/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("Upload successful");
    } catch (error) {
      console.error("Upload error", error);
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(3000 - elapsedTime, 0);
      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    }
  };

  const handleRunModel = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3100/run-model");
      console.log(response.data);
      if (response.data && response.data.plot1 && response.data.plot2 && response.data.plot3) {
        setPlotImages({
          plot1: `data:image/png;base64,${response.data.plot1}`,
          plot2: `data:image/png;base64,${response.data.plot2}`,
          plot3: `data:image/png;base64,${response.data.plot3}`
        }); // Set the plot images in the state

        // Set the percentages in the state
        setOverallPercentage(response.data.overall_percentage);
        setCompliancePercentage(response.data.compliance_percentage);
      }
      console.log("Model run successful", response.data);
    } catch (error) {
      console.error("Model run error", error);
    } finally {
      setLoading(false);
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
      <Button colorScheme="blue" onClick={handleUpload} isLoading={loading}>Upload</Button>
      <Button colorScheme="green" onClick={handleRunModel} isLoading={loading}>Run Model</Button>

      {loading && <Spinner size="xl" />}
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