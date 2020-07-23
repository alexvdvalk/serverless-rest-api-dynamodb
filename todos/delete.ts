import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { generateResponse } from "./generateResponse";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const deleteRecord: APIGatewayProxyHandler = async (
  event,
  _context
): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters.id;

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id,
    },
  };
  try {
    // First Check if the item exists
    const exists = await dynamoDb.get(params).promise();
    if (!exists.Item) {
      return generateResponse(400, { error: "That Item does not exist" });
    }
    await dynamoDb.delete(params).promise();
    return generateResponse(200, { success: "Item deleted successfully" });
  } catch (err) {
    console.log("err", err);
    return generateResponse(500, { error: "Something went wrong" });
  }
};
