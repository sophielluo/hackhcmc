// import React, { useState } from 'react';
// import { Button, VStack, Radio, RadioGroup, Stack } from '@chakra-ui/react';

// function FileOrFolderUpload() {
//   const [inputType, setInputType] = useState('files'); // Default to file input

//   const handleFileChange = (event) => {
//     const files = event.target.files;
//     console.log(files.length, 'files or folders selected');
//     // Here, you can process the files or folders
//   };

//   const handleRadioChange = (value) => {
//     setInputType(value);
//   };

//   return (
//     <VStack spacing={4}>
//       <RadioGroup onChange={handleRadioChange} value={inputType}>
//         <Stack direction="row">
//           <Radio value="files">Files</Radio>
//           <Radio value="folder">Folder</Radio>
//         </Stack>
//       </RadioGroup>
//       {inputType === 'files' ? (
//         <input
//           type="file"
//           onChange={handleFileChange}
//           multiple
//           style={{ display: 'none' }}
//           id="file-input"
//         />
//       ) : (
//         <input
//           type="file"
//           onChange={handleFileChange}
//           webkitdirectory="true"
//           directory="true"
//           style={{ display: 'none' }}
//           id="folder-input"
//         />
//       )}
//       <Button onClick={() => document.getElementById(inputType === 'files' ? 'file-input' : 'folder-input').click()} colorScheme="gray">
//         Select {inputType === 'files' ? 'Files' : 'Folder'}
//       </Button>
//       <Button colorScheme="blue">Upload</Button>
//     </VStack>
//   );
// }

// export default FileOrFolderUpload;

// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  VStack,
  useBreakpointValue
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React from "react";
import { MdUpload } from "react-icons/md";
import Dropzone from "views/admin/profile/components/Dropzone";

export default function FileOrFolderUpload(props) {
  const { ...rest } = props;

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const brandColor = useColorModeValue("brand.500", "white");
  const textColorSecondary = useColorModeValue("gray.400", "gray.200");

  // Responsive design adjustments
  const flexDirection = useBreakpointValue({ base: "column", md: "row" });

  return (
    <Card {...rest} mb="20px" p="20px">
      <Flex direction={flexDirection} align="center" justify="space-between">
        <VStack spacing={4} align="center" flex="1">
          <Dropzone
            content={
              <Box textAlign="center">
                <Icon as={MdUpload} w="80px" h="80px" color={brandColor} mb="4" />
                <Text fontSize="xl" fontWeight="700" color={brandColor}>
                  Upload Files
                </Text>
                <Text fontSize="sm" color={textColorSecondary}>
                  PNG, JPG, and GIF files are allowed
                </Text>
              </Box>
            }
          />
        </VStack>
        <VStack spacing={4} flex="1" ml={{ md: 8 }}>
          <Text color={textColorPrimary} fontWeight="bold" fontSize="2xl">
            Analyze Images
          </Text>
          <Text color={textColorSecondary} fontSize="md">
            Upload the images that you wish to analyse compliance rate.
          </Text>
          <Button colorScheme="blue" size="lg">
            Upload
          </Button>
        </VStack>
      </Flex>
    </Card>
  );
}
