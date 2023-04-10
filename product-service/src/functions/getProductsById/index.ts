import { handlerPath } from '@libs';

export const getProductsById = {
  handler: `${handlerPath(__dirname)}/handler.getProductsById`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        cors: true,
        responses: {
          200: {
            description: 'getProductsById succescful API response',
            bodyType: 'Product'
          }
        }
      },
    },
  ],
};
