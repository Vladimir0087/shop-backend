import { SQSEvent } from 'aws-lambda';
import { TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();

import { client } from '../../utils/client';

const validateData = (data: any): boolean => {
  const { title, description, count, price } = data;
  if (typeof title === 'string' && title.length > 0 && 
  typeof description === 'string' && description.length > 0 &&
  parseInt(count) > 0 && parseInt(price) > 0) {
    return true;
  } else {
    return false;
  }
};

export const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    const snsClient = new SNSClient({ region: 'us-east-1' });
    console.log('event.Records.length: ', event.Records.length);
    for (const record of event.Records) {
      const inputData = JSON.parse(record.body);
      console.log('inputData: ', inputData);

      const isValidInputData = validateData(inputData);
      console.log('isValidInputData: ', isValidInputData);
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
      const newProduct = { id, title, description, price: parseInt(price) };
      const newStock = { id, count: parseInt(count) };

      console.log('prepare to write to DB product: ', newProduct);
      await client.send(
        new TransactWriteItemsCommand({
          TransactItems: [
            {Put: {TableName: process.env.PRODUCTS_DYNAMODB_NAME, Item: marshall(newProduct)}},
            {Put: {TableName: process.env.STOCKS_DYNAMODB_NAME, Item: marshall(newStock)}}
          ]
        })
      );
      const createdProduct = { ...newProduct, count };

      console.log('prepare to send email with createdProducts: ', createdProduct);
      await snsClient.send(
        new PublishCommand({
          Subject: 'New product created!',
          Message: JSON.stringify(createdProduct),
          TopicArn: process.env.SNS_ARN,
        })
      );
    }

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
