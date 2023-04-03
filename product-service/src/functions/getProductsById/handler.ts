import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import * as dotenv from 'dotenv';
dotenv.config();

import { client } from '../../utils/client';

const getItem = async (dataBaseName: string, id: string) => {

  const params = {
    TableName: dataBaseName,
    Key: marshall({ id }),
  };
  const { Item } = await client.send(new GetItemCommand(params));
  return Item ? unmarshall(Item) : null;
};

export const getProductsById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('getProductsById Lambda triggered, params: ', event.pathParameters);
    const { productId } = event.pathParameters;
    const product = await getItem(process.env.PRODUCTS_DYNAMODB_NAME, productId);
    const stock = await getItem(process.env.STOCKS_DYNAMODB_NAME, productId);

    if (!product || !stock) return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({message: 'Product not found'}, null, 2)
    };

    product.count = stock.count;
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(product, null, 2)
    };

  } catch (error) {

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({message: error.message}, null, 2)
    }
  }
};
