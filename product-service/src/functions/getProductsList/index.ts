import { handlerPath } from '@libs';

export const getProductsList = {
  handler: `${handlerPath(__dirname)}/handler.getProductsList`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true
      },
    },
  ],
};
