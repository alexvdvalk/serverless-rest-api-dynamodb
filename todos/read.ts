import { DynamoDB, AWSError } from "aws-sdk";
import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { generateResponse } from "./generateResponse";

const dynamoDb = new DynamoDB.DocumentClient();

export const readSingle: APIGatewayProxyHandler = async (
  event,
  _context
): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters.id;

  const params: DynamoDB.DocumentClient.GetItemInput = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id: id },
  };
  try {
    const res = await dynamoDb.get(params).promise();
    console.log("res", res);
    if (res.Item) {
      // if res != {}
      return generateResponse(200, res.Item);
    }
    return generateResponse(400, { error: "ID not found" });
  } catch (err) {
    const error = err as AWSError;
    console.log("error", error.message);
    return generateResponse(500, { error });
  }
};

// TODO Update to query
export const readAll: APIGatewayProxyHandler = async (
  _event,
  _context
): Promise<APIGatewayProxyResult> => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
  };
  try {
    const res = await dynamoDb.scan(params).promise();
    return generateResponse(200, res.Items);
  } catch (err) {
    console.log("err", err);
    return generateResponse(500, { error: "something went wrong" });
  }
};
