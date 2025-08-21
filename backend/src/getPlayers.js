const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.TABLE_NAME;

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const params = event.queryStringParameters || {};
    const position = params.position;
    const q = params.q;

    let items = [];

    if (position) {
      const resp = await ddb.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "GSI1",
        KeyConditionExpression: "gsi1pk = :p",
        ExpressionAttributeValues: {
          ":p": `POSITION#${position}`
        }
      }));
      items = resp.Items || [];
    } else {
      const resp = await ddb.send(new ScanCommand({ TableName: TABLE_NAME }));
      items = resp.Items || [];
    }

    // Filter active and META rows
    items = items.filter((it) => it.sk === "META" && it.active !== false);

    if (q) {
      const qs = q.toLowerCase();
      items = items.filter((it) =>
        (it.name || "").toLowerCase().includes(qs) || String(it.number || "").includes(qs)
      );
    }

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(items)
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers: { "content-type": "application/json" }, body: JSON.stringify({ message: "Internal Server Error" }) };
  }
};


