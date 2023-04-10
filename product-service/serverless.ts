import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';
dotenv.config();

import { getProductsList, getProductsById, createProduct } from '@functions';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger','serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    region: 'us-east-1',
    stage: 'dev',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_DYNAMODB_NAME: process.env.PRODUCTS_DYNAMODB_NAME,
      STOCKS_DYNAMODB_NAME: process.env.STOCKS_DYNAMODB_NAME,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['dynamodb:*'],
            // Action: ['dynamodb:*', 'rds:*'],
            Resource: [
              process.env.ARN_PRODUCTS_DYNAMODB,
              process.env.ARN_STOCKS_DYNAMODB,
              // process.env.ARN_RDS_TABLE,
            ],
          },
        ],
      },
   },
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      host: 'g3zqd6y4k0.execute-api.us-east-1.amazonaws.com',
      useStage: true,
      basePath: '/dev',
      schemes: ['https']
    }
  },
  // resources: {
  //   Resources: {
  //     ProductsTable: {
  //       Type: "AWS::DynamoDB::Table",
  //       Properties: {
  //         TableName: "${self:provider.environment.PRODUCTS_DYNAMODB_TABLE_NAME}",
  //         AttributeDefinitions: [
  //           { AttributeName: "id", AttributeType: "S" },
  //           { AttributeName: "title", AttributeType: "S" },
  //           { AttributeName: "description", AttributeType: "S" },
  //           { AttributeName: "price", AttributeType: "N" },
  //         ],
  //         KeySchema: [
  //           { AttributeName: "id", KeyType: "HASH" },
  //           { AttributeName: "title", KeyType: "RANGE" },
  //           { AttributeName: "description", KeyType: "RANGE" },
  //           { AttributeName: "price", KeyType: "RANGE" },
  //         ],
  //         ProvisionedThroughput: {
  //           ReadCapacityUnits: "1",
  //           WriteCapacityUnits: "1",
  //         },
  //       },
  //     }
  //   }
  // }
  // resources: {
  //   Resources: {
  //     RDSMyProductsTable: {
  //       Type: "AWS::RDS::DBInstance",
  //       Properties: {
  //         AllocatedStorage : "5",
  //         DBInstanceClass : "db.t3.micro",
  //         DBName: "myNewTestSql",
  //         Engine : "mysql",
  //         EngineVersion : "8.0.25",
  //         MasterUsername : process.env.RDS_USER_NAME,
  //         MasterUserPassword : process.env.RDS_USER_Password,
  //       },
  //     }
  //   }
  // }
};

module.exports = serverlessConfiguration;
