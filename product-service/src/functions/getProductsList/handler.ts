import { APIGatewayProxyResult } from 'aws-lambda';
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import * as dotenv from 'dotenv';
dotenv.config();

import { client } from '../../utils/client';

const getAllItems = async (dataBaseName: string) => {
  const { Items } = await client.send(new ScanCommand({ TableName: dataBaseName }));
  return Items.map((item) => unmarshall(item));
};

export const getProductsList = async () : Promise<APIGatewayProxyResult> => {
  try {
    console.log('getProductsList Lambda triggered');
    const products = await getAllItems(process.env.PRODUCTS_DYNAMODB_NAME);
    const stocks = await getAllItems(process.env.STOCKS_DYNAMODB_NAME);
    const availableProductList = products.map((product) => {
      product.count = stocks.find((stock) => stock.id === product.id).count;
      return product;
    })

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(availableProductList, null, 2)
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
