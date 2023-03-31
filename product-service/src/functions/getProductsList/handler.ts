import { APIGatewayProxyResult } from 'aws-lambda';

import { products } from "./../../mocks/data";

export const getProductsList = async () : Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify(products, null, 2)
  };
};
