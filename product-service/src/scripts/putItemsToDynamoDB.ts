import { BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import * as dotenv from 'dotenv';
dotenv.config();

import { client } from '../utils/client';
import { availableProducts } from "../mocks/data";

const getAllProducts = () => {
  return availableProducts.map((product) => {
    return {
      PutRequest: {
        Item: {
          id: { S: product.id },
          title: { S: product.title },
          description: { S: product.description },
          price: { N: product.price.toString()},
        }
      }
    }
  })
};

const getAllStocks = () => {
  return availableProducts.map((product) => {
    return {
      PutRequest: {
        Item: {
          id: { S: product.id },
          count: { N: product.count.toString() },
        }
      }
    }
  })
};

const putItemsToDynamoDB = async () => {
  await client.send(
    new BatchWriteItemCommand({
      RequestItems: {
        [process.env.PRODUCTS_DYNAMODB_NAME] : getAllProducts(),
        [process.env.STOCKS_DYNAMODB_NAME] : getAllStocks(),
      }
    })
  );
};

putItemsToDynamoDB();
