const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.TABLE_NAME;

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const id = event.pathParameters && event.pathParameters.id;
    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ message: "Missing id" }) };
    }

    const resp = await ddb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { pk: `PLAYER#${id}`, sk: "META" }
    }));

    if (!resp.Item) {
      return { statusCode: 404, body: JSON.stringify({ message: "Not found" }) };
    }

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(resp.Item)
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers: { "content-type": "application/json" }, body: JSON.stringify({ message: "Internal Server Error" }) };
  }
};


