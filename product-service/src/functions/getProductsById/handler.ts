import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Product } from 'src/types/api-types';

import { products } from "../../mocks/data";

const getOneProductById = (productId: string): Product => {
  const product = products.find((prod) => prod.id === productId);
  if (product) {
    return product
  } else {
    throw new Error('Product not found in the list of products');
  }
};

export const getProductsById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { productId } = event.pathParameters;
  try {
    const product = getOneProductById(productId);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(product, null, 2)
    };
  } catch (error) {
    if (error.message === 'Product not found in the list of products') {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({message: error.message}, null, 2)
      }
    }
  }
};
