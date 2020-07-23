"use strict";

import * as uuid from "uuid";

import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { generateResponse } from "./generateResponse";

const dynamoDb = new DynamoDB.DocumentClient();

export const create: APIGatewayProxyHandler = async (
  event,
  _context
): Promise<APIGatewayProxyResult> => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.text !== "string") {
    console.log("Validation Failed");
    return generateResponse(400, "Validation Failed");
  }
  console.log("table", process.env.DYNAMODB_TABLE);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      text: data.text,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };
  let result;
  try {
    result = await dynamoDb.put(params).promise();
    console.log("result", result);
    return generateResponse(200, params.Item);
  } catch (err) {
    console.log(err);
    return generateResponse(400, "Couldn't create the todo item.");
  }
};
