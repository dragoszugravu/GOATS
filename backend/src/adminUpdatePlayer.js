const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

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

    const body = JSON.parse(event.body || "{}");

    const fields = ["name", "number", "position", "bio", "imageKey", "active"];
    const setParts = [];
    const names = {};
    const values = { ":updatedAt": new Date().toISOString() };
    for (const f of fields) {
      if (body[f] !== undefined) {
        setParts.push(`#${f} = :${f}`);
        names[`#${f}`] = f;
        values[`:${f}`] = f === "number" ? Number(body[f]) : body[f];
      }
    }
    setParts.push(`#updatedAt = :updatedAt`);

    if (setParts.length === 1) return { statusCode: 400, body: JSON.stringify({ message: "No updates provided" }) };

    const resp = await ddb.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { pk: `PLAYER#${id}`, sk: "META" },
      UpdateExpression: `SET ${setParts.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: "ALL_NEW"
    }));

    return { statusCode: 200, headers: { "content-type": "application/json" }, body: JSON.stringify(resp.Attributes) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers: { "content-type": "application/json" }, body: JSON.stringify({ message: "Internal Server Error" }) };
  }
};


