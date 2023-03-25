import { products } from "./../../mocks/data";

export const getProductsList = async () => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(products, null, 2),
  };
};
