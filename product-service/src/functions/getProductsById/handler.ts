import { products } from "../../mocks/data";

export const getProductsById = async (event) => {
  console.log('--getProductsById--event---', event);
  const { productId } = event.pathParameters;
  const product = products.find((prod) => prod.id === productId);
  if (!product) return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({message: "Product not found"}, null, 2),
  }
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(product, null, 2),
  };
};
