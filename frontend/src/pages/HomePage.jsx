import { Container, SimpleGrid, Text, VStack, Input, Button, HStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/product";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
  const { fetchProducts, products = [] } = useProductStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState(""); // search input
  const [filteredProducts, setFilteredProducts] = useState(products); // products to show

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await fetchProducts();
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Sync filteredProducts with products when they change
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleSearch = async () => {
    if (!query.trim()) {
      setFilteredProducts(products);
      return;
    }
  
    try {
      const res = await fetch("http://localhost:3000/api/gemini/suggestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: query,
        }),
      });
  
      const data = await res.json();
      console.log("Gemini response:", data);
  
      // Parse Gemini response into array of IDs
      let ids = [];
  
      if (Array.isArray(data.message)) {
        ids = data.message;
      } else if (typeof data.message === "string" && data.message.includes(",")) {
        ids = data.message.split(",").map((id) => id.trim());
      } else if (typeof data.message === "string" && data.message.length > 0 && data.message !== "None") {
        ids = [data.message];
      }
  
      // Filter products based on IDs
      if (ids.length > 0) {
        setFilteredProducts(products.filter((p) => ids.includes(p._id)));
      } else {
        setFilteredProducts([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed. Please try again.");
    }
  };
  


  if (loading) {
    return <Text textAlign="center" mt={12}>Loading products...</Text>;
  }

  if (error) {
    return <Text textAlign="center" mt={12} color="red.500">{error}</Text>;
  }

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={8}>
        {/* 🔎 Search bar */}
        <HStack w="full" justify="center" spacing={2}>
          <Input
            placeholder="Search products using Google’s Gemini AI tool..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxW="lg"
            bg="white"
            color="black"
            _placeholder={{ color: "gray.500" }}
          />
          <Button colorScheme="blue" onClick={handleSearch}>
            Search
          </Button>
        </HStack>

        <Text
          fontSize="30"
          fontWeight="bold"
          bgGradient="linear(to-r, cyan.400, blue.500)"
          bgClip="text"
          textAlign="center"
        >
          Current Products 🚀
        </Text>

        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={10}
          w="full"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </SimpleGrid>

        {filteredProducts.length === 0 && (
          <Text fontSize="xl" textAlign="center" fontWeight="bold" color="gray.500">
            No products found 😢{" "}
            <Link to="/create">
              <Text as="span" color="blue.500" _hover={{ textDecoration: "underline" }}>
                Create a product
              </Text>
            </Link>
          </Text>
        )}
      </VStack>
    </Container>
  );
};

export default HomePage;
