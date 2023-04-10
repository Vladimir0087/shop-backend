import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();

import { client } from '../../utils/client';

const validateData = (data: any): boolean => {
  const { title, description, count, price } = data;
  if (typeof title === 'string' && title.length > 0 && 
  typeof description === 'string' && description.length > 0 &&
  typeof count === 'number' && count > 0 && 
  typeof price === 'number' && price > 0) {
    return true;
  } else {
    return false;
  }
};

export const createProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('createProduct Lambda triggered, body: ', event.body);
    const inputData = JSON.parse(event.body);
    const isValidInputData = validateData(inputData);

    if (!isValidInputData) return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: "Invalid input data",
      }, null, 2)
    }

    const { title, description, count, price } = inputData;
    const id = uuidv4();
    const newProduct = { id, title, description, price };
    const newStock = { id, count };
    await client.send(
      new TransactWriteItemsCommand({
        TransactItems: [
          {Put: {TableName: process.env.PRODUCTS_DYNAMODB_NAME, Item: marshall(newProduct)}},
          {Put: {TableName: process.env.STOCKS_DYNAMODB_NAME, Item: marshall(newStock)}}
        ]
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
         message: "Product and stock successfully created",
        newProduct: { ...newProduct, count },
      }, null, 2)
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
