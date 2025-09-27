import React from 'react'
import { Box, Button, Container, Heading, Input, VStack, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';


const CreatePage = () => {
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        image: '',
    });

    const handleAddProduct = () => {
        // Logic to handle adding the new product
        console.log('New Product:', newProduct);
        // Reset form
        setNewProduct({ name: '', price: '', image: '' });
    }

  return <Container maxW="container.sm">
    <VStack spacing={8}>
        <Heading as={"h1"} size={"2x1"} textAlign={"center"} mb={8}>
            Create New Product
        </Heading>

        <Box
            w={"full"} bg={useColorModeValue("white", "gray.800")}
            shadow={"md"} rounded={"lg"} p={6} textAlign={"center"}
        >
            <VStack spacing={4}>
                <Input
                    placeholder="Product Name"
                    name='name' 
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />

                <Input
                    placeholder="Product Price"
                    name='price' 
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />

                <Input
                    placeholder="Product Image URL"
                    name='image' 
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                />

                <Button colorScheme={"blue"} onClick={handleAddProduct} w="full">
                    Add Product
                </Button>
            </VStack>
        </Box>

    </VStack> 

  </Container>
};

export default CreatePage