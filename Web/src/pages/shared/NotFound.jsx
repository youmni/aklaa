import React from "react";
import { Box, Heading, Text, Button, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Box
      minH="100vh"
      bg="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Stack spacing={8} textAlign="center" align="center">
        <Heading
          fontSize={{ base: "8xl", md: "9xl" }}
          fontWeight="bold"
          color="black"
          lineHeight="1"
        >
          404
        </Heading>
        
        <Stack spacing={4}>
          <Heading
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="semibold"
            color="black"
          >
            Page Not Found
          </Heading>
          
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="gray.600"
            maxW="lg"
            px={4}
          >
            Sorry, the page you are looking for does not exist or you don't have 
            permission to access it. Please check the URL or return to the home page.
          </Text>
        </Stack>
        
        <Button
          onClick={handleGoHome}
          bg="black"
          color="white"
          size="lg"
          px={10}
          py={6}
          fontSize="lg"
          borderRadius="md"
          _hover={{ bg: "gray.800" }}
          _active={{ bg: "gray.900" }}
        >
          Go to Home
        </Button>
      </Stack>
    </Box>
  );
};

export default NotFound;