import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as dotenv from 'dotenv';
dotenv.config();

import { importProductsFile } from "../functions/importProductsFile/handler";

jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner');

describe('importProductsFile hanler', () => {
  const mockEvent = { queryStringParameters: { name: 'document.csv'}};
  const mockedSignedUrl = 'mockedSignedUrl';
  // (getSignedUrl as jest.Mock).mockResolvedValue(mockedSignedUrl);
  
  it('should return correct data', async () => {
    (getSignedUrl as jest.Mock).mockResolvedValue(mockedSignedUrl);
    const result = await importProductsFile(mockEvent as any);

    expect(S3Client).toHaveBeenCalledWith({
      region: 'us-east-1',
    });
    expect(PutObjectCommand).toHaveBeenCalledWith({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `uploaded/${mockEvent.queryStringParameters.name}`,
    });
    expect(result.body).toEqual(mockedSignedUrl);
  });

  it('should return error', async () => {
    const errorMessage = 'Test error';
    (getSignedUrl as jest.Mock).mockRejectedValue(new Error(errorMessage));
    const result = await importProductsFile(mockEvent as any);
    console.log('result: ', result);

    expect(result.body).toEqual( JSON.stringify({message: errorMessage}, null, 2));
    expect(result.statusCode).toEqual(500);
  });
});
