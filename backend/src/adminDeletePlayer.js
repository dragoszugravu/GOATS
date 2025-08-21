const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.TABLE_NAME;

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const claims = event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.jwt && event.requestContext.authorizer.jwt.claims;
    if (!claims || !claims["cognito:groups"] || !claims["cognito:groups"].includes("admin")) {
      return { statusCode: 403, body: JSON.stringify({ message: "Forbidden" }) };
    }

    const id = event.pathParameters && event.pathParameters.id;
    if (!id) return { statusCode: 400, body: JSON.stringify({ message: "Missing id" }) };

    await ddb.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { pk: `PLAYER#${id}`, sk: "META" }
    }));

    return { statusCode: 204 };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers: { "content-type": "application/json" }, body: JSON.stringify({ message: "Internal Server Error" }) };
  }
};


