// Chakra imports
import {
  Box,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Button,
  Center,
  Text
} from "@chakra-ui/react";
// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useContext } from "react";
import {
  MdImage,
  MdRemoveRedEye,
  MdGppGood,
} from "react-icons/md";
import CardSOverlap from "./components/CardSOverlap";
import CardM from "./components/CardM";
import CardS from "./components/CardS";
import { ImageContext } from '../../../ImageContext.js';
import annotated_image_0 from './demoPics/annotated_image_0.jpg';
import annotated_image_3 from './demoPics/annotated_image_3.jpg';
import annotated_image_13 from './demoPics/annotated_image_13.jpg';
import annotated_image_18 from './demoPics/annotated_image_18.jpg';

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  // Access context
  const { plotImages, overallPercentage, compliancePercentage } = useContext(ImageContext);
  const noImagesUploaded = !plotImages.plot1 && !plotImages.plot2 && !plotImages.plot3;

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'>
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdImage} color={brandColor} />
              }
            />
          }
          name='Images Processed'
          value='50'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdRemoveRedEye} color={brandColor} />
              }
            />
          }
          name='Overall Visibility Score'
          value={overallPercentage !== null ? `${overallPercentage}%` : 'N/A'}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdGppGood} color={brandColor} />
              }
            />
          }
          name='Overall Compliance Rate'
          value={compliancePercentage !== null ? `${compliancePercentage}%` : 'N/A'}
        />
      </SimpleGrid>

      {noImagesUploaded ? (
        <Center h="60vh" bg="gray.100">
          <Text fontSize="xl" color="gray.500">Run Model</Text>
        </Center>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
            <CardM imgsrc={plotImages.plot1}/>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
              <CardS imgsrc={plotImages.plot2} title="Distribution By Brand"/>
              <CardS imgsrc={plotImages.plot3} title="Distribution By Context"/>
            </SimpleGrid>
          </SimpleGrid>
          <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
              <CardSOverlap imgsrc={annotated_image_0}/>
              <CardSOverlap imgsrc={annotated_image_3}/>
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
              <CardSOverlap imgsrc={annotated_image_13}/>
              <CardSOverlap imgsrc={annotated_image_18}/>
            </SimpleGrid>
          </SimpleGrid>
        </>
      )}

      <Box display="flex" justifyContent="center">
        <Button colorScheme="blue" w='280px'>Download All</Button>
      </Box>
    </Box>
  );
}