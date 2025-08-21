data "archive_file" "adminCreatePlayer" {
  type        = "zip"
  source_dir  = "${path.root}/../../backend/dist/zips/adminCreatePlayer"
  output_path = "${path.root}/.artifacts/adminCreatePlayer.zip"
}

data "archive_file" "adminUpdatePlayer" {
  type        = "zip"
  source_dir  = "${path.root}/../../backend/dist/zips/adminUpdatePlayer"
  output_path = "${path.root}/.artifacts/adminUpdatePlayer.zip"
}

data "archive_file" "adminDeletePlayer" {
  type        = "zip"
  source_dir  = "${path.root}/../../backend/dist/zips/adminDeletePlayer"
  output_path = "${path.root}/.artifacts/adminDeletePlayer.zip"
}

data "archive_file" "adminSignUpload" {
  type        = "zip"
  source_dir  = "${path.root}/../../backend/dist/zips/adminSignUpload"
  output_path = "${path.root}/.artifacts/adminSignUpload.zip"
}

resource "aws_lambda_function" "adminCreatePlayer" {
  function_name = "${local.project_name}-adminCreatePlayer"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  architectures = ["arm64"]
  memory_size   = 256
  timeout       = 5

  filename         = data.archive_file.adminCreatePlayer.output_path
  source_code_hash = data.archive_file.adminCreatePlayer.output_base64sha256

  environment { variables = { TABLE_NAME = aws_dynamodb_table.players.name } }
}

resource "aws_lambda_function" "adminUpdatePlayer" {
  function_name = "${local.project_name}-adminUpdatePlayer"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  architectures = ["arm64"]
  memory_size   = 256
  timeout       = 5

  filename         = data.archive_file.adminUpdatePlayer.output_path
  source_code_hash = data.archive_file.adminUpdatePlayer.output_base64sha256

  environment { variables = { TABLE_NAME = aws_dynamodb_table.players.name } }
}

resource "aws_lambda_function" "adminDeletePlayer" {
  function_name = "${local.project_name}-adminDeletePlayer"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  architectures = ["arm64"]
  memory_size   = 256
  timeout       = 5

  filename         = data.archive_file.adminDeletePlayer.output_path
  source_code_hash = data.archive_file.adminDeletePlayer.output_base64sha256

  environment { variables = { TABLE_NAME = aws_dynamodb_table.players.name } }
}

resource "aws_lambda_function" "adminSignUpload" {
  function_name = "${local.project_name}-adminSignUpload"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  architectures = ["arm64"]
  memory_size   = 256
  timeout       = 5

  filename         = data.archive_file.adminSignUpload.output_path
  source_code_hash = data.archive_file.adminSignUpload.output_base64sha256

  environment { variables = { UPLOADS_BUCKET = aws_s3_bucket.uploads.bucket } }
}

resource "aws_iam_policy" "s3_presign_put" {
  name        = "${local.project_name}-s3-presign-put"
  description = "Allow presigned PUTs to uploads bucket"
  policy      = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:PutObject",
          "s3:AbortMultipartUpload",
          "s3:PutObjectAcl",
          "s3:ListBucketMultipartUploads",
          "s3:ListBucket"
        ],
        Resource = [
          aws_s3_bucket.uploads.arn,
          "${aws_s3_bucket.uploads.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_presign" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.s3_presign_put.arn
}

# JWT authorizer using Cognito
resource "aws_apigatewayv2_authorizer" "cognito" {
  api_id          = aws_apigatewayv2_api.http.id
  authorizer_type = "JWT"
  name            = "cognito"
  identity_sources = ["$request.header.Authorization"]
  jwt_configuration {
    audience = [aws_cognito_user_pool_client.app.id]
    issuer   = "https://cognito-idp.${var.region}.amazonaws.com/${aws_cognito_user_pool.this.id}"
  }
}

resource "aws_apigatewayv2_integration" "adminCreatePlayer" {
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.adminCreatePlayer.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "adminUpdatePlayer" {
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.adminUpdatePlayer.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "adminDeletePlayer" {
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.adminDeletePlayer.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "adminSignUpload" {
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.adminSignUpload.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "adminCreatePlayer" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "POST /players"
  target    = "integrations/${aws_apigatewayv2_integration.adminCreatePlayer.id}"
  authorizer_id = aws_apigatewayv2_authorizer.cognito.id
  authorization_type = "JWT"
}

resource "aws_apigatewayv2_route" "adminUpdatePlayer" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "PUT /players/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.adminUpdatePlayer.id}"
  authorizer_id = aws_apigatewayv2_authorizer.cognito.id
  authorization_type = "JWT"
}

resource "aws_apigatewayv2_route" "adminDeletePlayer" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "DELETE /players/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.adminDeletePlayer.id}"
  authorizer_id = aws_apigatewayv2_authorizer.cognito.id
  authorization_type = "JWT"
}

resource "aws_apigatewayv2_route" "adminSignUpload" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "POST /uploads/sign"
  target    = "integrations/${aws_apigatewayv2_integration.adminSignUpload.id}"
  authorizer_id = aws_apigatewayv2_authorizer.cognito.id
  authorization_type = "JWT"
}

resource "aws_lambda_permission" "apigw_adminCreate" {
  statement_id  = "AllowAPIGatewayInvokeAdminCreate"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.adminCreatePlayer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}

resource "aws_lambda_permission" "apigw_adminUpdate" {
  statement_id  = "AllowAPIGatewayInvokeAdminUpdate"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.adminUpdatePlayer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}

resource "aws_lambda_permission" "apigw_adminDelete" {
  statement_id  = "AllowAPIGatewayInvokeAdminDelete"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.adminDeletePlayer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}

resource "aws_lambda_permission" "apigw_adminSignUpload" {
  statement_id  = "AllowAPIGatewayInvokeAdminSignUpload"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.adminSignUpload.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}


