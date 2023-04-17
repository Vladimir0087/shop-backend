import { handlerPath } from '@libs';

export const catalogBatchProcess = {
  handler: `${handlerPath(__dirname)}/handler.catalogBatchProcess`,
  events: [
    {
      sqs: {
        arn: {
          "Fn::GetAtt": [ 
          "SQSQueue", 
          "Arn" 
        ]},
        batchSize: 5
      },
    },
  ],
};
