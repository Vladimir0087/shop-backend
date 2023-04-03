import { handlerPath } from '@libs';

export const createProduct = {
  handler: `${handlerPath(__dirname)}/handler.createProduct`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        cors: true,
        responses: {
          200: {
            description: 'createProduct succescful API response',
            bodyType: 'Product'
          }
        }
      },
    },
  ],
};
