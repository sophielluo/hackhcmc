// Chakra imports
import {
    Box,
    Flex,
    Text,
    useColorModeValue,
  } from "@chakra-ui/react";
  import Card from "components/card/Card.js";
  // Custom components
  import React from "react";
  import { Image } from "@chakra-ui/react";
  
  export default function CardM({imgsrc}) {
  
    // Chakra Color Mode
    const textColor = useColorModeValue("secondaryGray.900", "white");
    return (
      <Card align='center' direction='column' w='100%'>
        <Flex 
          justifyContent='space-between'
          align='center' 
          w='100%' 
          px='15px' 
          mb='8px'>
          <Text
            me='auto'
            color={textColor}
            fontSize='xl'
            fontWeight='700'
            lineHeight='100%'>
            Key Element Instances by Brand
          </Text>
        </Flex>
  
        {/* FINAL IMAGE CONFIGURATION */}
        <Image
          src={imgsrc}
          w='100%'
          h='auto'
          borderRadius='20px'
          boxShadow='lg' // Add shadow to the image
          objectFit='cover' // Make sure the image covers the container
          objectPosition='center' // Crop out the middle portion
        />
      </Card>
    );
  }
  