import React from 'react'
import { Box, Button, Container, Heading, Input, VStack, useColorModeValue , useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useProductStore } from "../store/product";

const CreatePage = () => {
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        image: '',
        description: '', 
    });

    const toast = useToast(); 
    const { createProduct } = useProductStore();

    const handleAddProduct = async () => {
        const { name, price, image, description } = newProduct;

        if (!name || !price || !image || !description) {
            toast({
              title: "Error",
              description: "Please fill all fields",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            return;
        }

        console.log('New Product:', newProduct);
        
        const { success, message } = await createProduct({
            name,
            price: Number(price),
            image,
            description,
        });

        if (!success) {
            toast({
                title: "Error",
                description: message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        } else {
            toast({
                title: "Success",
                description: "Product created successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        }

        setNewProduct({ name: '', price: '', image: '', description: '' }); // ✅ Reset
    };

    return (
      <Container maxW="container.sm">
        <VStack spacing={8}>
            <Heading as="h1" size="2xl" textAlign="center" mb={8}>
                Create New Product
            </Heading>

            <Box
                w="full" bg={useColorModeValue("white", "gray.800")}
                shadow="md" rounded="lg" p={6} textAlign="center"
            >
                <VStack spacing={4}>
                    <Input
                        placeholder="Product Name"
                        name="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />

                    <Input
                        placeholder="Product Price"
                        name="price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />

                    <Input
                        placeholder="Product Image URL"
                        name="image"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    />

                    <Input
                        placeholder="Product Description"
                        name="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />

                    <Button colorScheme="blue" onClick={handleAddProduct} w="full">
                        Add Product
                    </Button>
                </VStack>
            </Box>
        </VStack> 
      </Container>
    );
};

export default CreatePage;
