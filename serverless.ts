import { Serverless } from "serverless/aws";

const serverlessConfiguration: Serverless = {
  service: {
    name: "practice-work-rest-api",
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },

  // includeModules:
  //       forceExclude:   #excluding aws-sdk greatly reduces the bundle size
  //         - aws-sdk
  frameworkVersion: ">=1.72.0",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: { forceExclude: ["aws-sdk"] },
    },
  },
  // Add the serverless-webpack plugin
  plugins: ["serverless-webpack", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    region: "eu-west-2",
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      DYNAMODB_TABLE: "${self:service}-${opt:stage, self:provider.stage}",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
        ],
        Resource:
          "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.DYNAMODB_TABLE}",
      },
    ],
  },
  functions: {
    create: {
      handler: "todos/create.create",
      memorySize: 128,
      events: [
        {
          httpApi: {
            method: "put",
            path: "/todos",
            // cors: true,
          },
        },
      ],
    },
    readSingle: {
      handler: "todos/read.readSingle",
      memorySize: 128,
      events: [
        {
          httpApi: {
            method: "get",
            path: "/todos/{id}",
          },
        },
      ],
    },
    readAll: {
      handler: "todos/read.readAll",
      memorySize: 128,
      events: [
        {
          httpApi: {
            method: "get",
            path: "/todos",
          },
        },
      ],
    },
    delete: {
      handler: "todos/delete.deleteRecord",
      memorySize: 128,
      events: [
        {
          httpApi: {
            method: "delete",
            path: "/todos/{id}",
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      TodosDynamoDbTable: {
        Type: "AWS::DynamoDB::Table",
        DeletionPolicy: "Retain",
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          TableName: "${self:provider.environment.DYNAMODB_TABLE}",
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
