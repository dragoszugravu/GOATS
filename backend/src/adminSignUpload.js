const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const UPLOADS_BUCKET = process.env.UPLOADS_BUCKET;

const s3 = new S3Client({});

exports.handler = async (event) => {
  try {
    const claims = event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.jwt && event.requestContext.authorizer.jwt.claims;
    if (!claims || !claims["cognito:groups"] || !claims["cognito:groups"].includes("admin")) {
      return { statusCode: 403, body: JSON.stringify({ message: "Forbidden" }) };
    }

    const body = JSON.parse(event.body || "{}");
    const { key, contentType } = body;
    if (!key || !contentType) return { statusCode: 400, body: JSON.stringify({ message: "Missing key or contentType" }) };

    const command = new PutObjectCommand({
      Bucket: UPLOADS_BUCKET,
      Key: key,
      ContentType: contentType
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 300 });

    return { statusCode: 200, headers: { "content-type": "application/json" }, body: JSON.stringify({ url }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers: { "content-type": "application/json" }, body: JSON.stringify({ message: "Internal Server Error" }) };
  }
};


