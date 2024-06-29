/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import {
    Box,
    Icon,
    SimpleGrid,
    useColorModeValue,
    Button,
  } from "@chakra-ui/react";
// Assets
// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React from "react";
import {
  MdImage,
  MdRemoveRedEye,
  MdGppGood,
} from "react-icons/md";
import CardSOverlap from "./components/CardSOverlap";
import CardM from "./components/CardM";
import CardS from "./components/CardS";
import annotated_image_0 from './demoPics/annotated_image_0.jpg';
import annotated_image_3 from './demoPics/annotated_image_3.jpg';
import annotated_image_13 from './demoPics/annotated_image_13.jpg';
import annotated_image_18 from './demoPics/annotated_image_18.jpg';
import bar from './demoPics/bar.jpg';
import pie1 from './demoPics/pie1.jpg';
import pie2 from './demoPics/pie2.jpg';

  
export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
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
          value='3298'
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
          value='64%'
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
          value='86%'
        />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
        <CardM imgsrc={bar}/>
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <CardS imgsrc={pie1} title="Distribution By Brand"/>
          <CardS imgsrc={pie2} title="Distribution By Context"/>
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
      <Box display="flex" justifyContent="center">
        <Button colorScheme="blue" w='280px'>Download All</Button>
      </Box>
    </Box>
  );
}
  