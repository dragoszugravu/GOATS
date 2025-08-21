const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const crypto = require("crypto");

const TABLE_NAME = process.env.TABLE_NAME;

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const claims = event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.jwt && event.requestContext.authorizer.jwt.claims;
    if (!claims || !claims["cognito:groups"] || !claims["cognito:groups"].includes("admin")) {
      return { statusCode: 403, body: JSON.stringify({ message: "Forbidden" }) };
    }

    const body = JSON.parse(event.body || "{}");
    const required = ["name", "number", "position"];
    for (const f of required) if (body[f] === undefined || body[f] === null || body[f] === "") return { statusCode: 400, body: JSON.stringify({ message: `Missing ${f}` }) };

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const item = {
      pk: `PLAYER#${id}`,
      sk: "META",
      id,
      name: body.name,
      number: Number(body.number),
      position: body.position,
      bio: body.bio || "",
      imageKey: body.imageKey || null,
      active: body.active !== false,
      createdAt: now,
      updatedAt: now,
      gsi1pk: `POSITION#${body.position}`,
      gsi1sk: body.name,
      gsi2pk: body.number ? `NUMBER#${body.number}` : undefined
    };

    await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: item, ConditionExpression: "attribute_not_exists(pk)" }));
    return { statusCode: 201, headers: { "content-type": "application/json" }, body: JSON.stringify(item) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers: { "content-type": "application/json" }, body: JSON.stringify({ message: "Internal Server Error" }) };
  }
};


