import { TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import * as dotenv from 'dotenv';
dotenv.config();

import { catalogBatchProcess } from "../functions/catalogBatchProcess/handler";

jest.mock('@aws-sdk/client-dynamodb');
jest.mock('@aws-sdk/client-sns');
jest.mock('../utils/client.ts');

describe('catalogBatchProcess hanler', () => {
  const body1 = JSON.stringify({ 
    description: "Short Product Description1",
    count: 7,
    price: 24,
    title: "ProductOne"
  }, null , 2)
  const body2 = JSON.stringify({ 
    description: "Short Product Description2",
    count: 2,
    price: 22,
    title: "ProductTwo"
  }, null , 2)
  const badBody = JSON.stringify({ 
    description: "Short Product Description2",
    count: 2,
    price: 22,
  }, null , 2)

  const mockEvent = { Records: [{ body: body1}, {body: body2}] };
  const badMockEvent = { Records: [{ body: badBody}] };

  it('should run coomands', async () => {
    await catalogBatchProcess(mockEvent as any);
    expect(SNSClient).toHaveBeenCalledWith({
      region: 'us-east-1',
    });
    expect(TransactWriteItemsCommand).toHaveBeenCalled();
    expect(TransactWriteItemsCommand).toHaveBeenCalledTimes(2);
    expect(PublishCommand).toHaveBeenCalled();
    expect(PublishCommand).toHaveBeenCalledTimes(1);
  });

  it('if invalid ID should return error', async () => {
    const result = await catalogBatchProcess(badMockEvent as any);
    expect(result.body).toEqual( JSON.stringify({message: "Invalid input data"}, null, 2));
    expect(result.statusCode).toEqual(400);
  });

  it('should return error 500', async () => {
    const result = await catalogBatchProcess({} as any);
    console.log('result: ', result);
    expect(result.statusCode).toEqual(500);
  });
});
