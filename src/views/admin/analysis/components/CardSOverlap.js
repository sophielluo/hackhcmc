// Chakra imports
import { Box, Flex, Text, Select, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import PieChart from "components/charts/PieChart";
import { pieChartDataLogo, pieChartOptionsLogo } from "variables/charts";
import { VSeparator } from "components/separator/Separator";
import React from "react";
import { Image } from "@chakra-ui/react";


export default function CardS({imgsrc, title}) {
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  return (
    <Card p='20px' align='center' direction='column' w='100%'>
      <Flex 
        justifyContent='space-between'
        align='center'
        w='100%'
        px={{ base: "0px", "2xl": "10px" }}
        mb='0px'>
        <Text
            me='auto'
            color={textColor}
            fontSize='xl'
            fontWeight='700'
            lineHeight='100%'>
            {title}
          </Text>
      </Flex>
      {/* FINAL IMAGE CONFIGURATION */}
      <Image
            src={imgsrc}
            // w={{ base: "100%", "3xl": "100%" }}
            w={{ base: "230px", "3xl": "230px" }}
            h={{ base: "230px", "3xl": "230px" }}
            borderRadius='20px'
            boxShadow='lg' // Add shadow to the image
            objectFit='cover' // Make sure the image covers the container
            objectPosition='center' // Crop out the middle portion
      />
    </Card>
  );
}
