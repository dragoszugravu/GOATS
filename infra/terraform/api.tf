resource "aws_iam_role" "lambda_exec" {
  name               = "${local.project_name}-lambda-exec"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = { Service = "lambda.amazonaws.com" },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "archive_file" "getPlayers" {
  type        = "zip"
  source_dir  = "${path.root}/../../backend/dist/zips/getPlayers"
  output_path = "${path.root}/.artifacts/getPlayers.zip"
}

data "archive_file" "getPlayerById" {
  type        = "zip"
  source_dir  = "${path.root}/../../backend/dist/zips/getPlayerById"
  output_path = "${path.root}/.artifacts/getPlayerById.zip"
}

resource "aws_lambda_function" "getPlayers" {
  function_name = "${local.project_name}-getPlayers"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  architectures = ["arm64"]
  memory_size   = 256
  timeout       = 5

  filename         = data.archive_file.getPlayers.output_path
  source_code_hash = data.archive_file.getPlayers.output_base64sha256

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.players.name
    }
  }
}

resource "aws_lambda_function" "getPlayerById" {
  function_name = "${local.project_name}-getPlayerById"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  architectures = ["arm64"]
  memory_size   = 256
  timeout       = 5

  filename         = data.archive_file.getPlayerById.output_path
  source_code_hash = data.archive_file.getPlayerById.output_base64sha256

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.players.name
    }
  }
}

resource "aws_iam_policy" "ddb_read" {
  name        = "${local.project_name}-ddb-read"
  description = "Allow read access to players table"
  policy      = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ],
        Resource = [
          aws_dynamodb_table.players.arn,
          "${aws_dynamodb_table.players.arn}/index/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_ddb_read" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.ddb_read.arn
}

resource "aws_apigatewayv2_api" "http" {
  name          = "${local.project_name}-http"
  protocol_type = "HTTP"
  cors_configuration {
    allow_credentials = false
    allow_headers     = ["*"]
    allow_methods     = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_origins     = ["*"]
    max_age           = 3600
  }
}

resource "aws_apigatewayv2_integration" "getPlayers" {
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.getPlayers.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "getPlayerById" {
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.getPlayerById.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "getPlayers" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "GET /players"
  target    = "integrations/${aws_apigatewayv2_integration.getPlayers.id}"
}

resource "aws_apigatewayv2_route" "getPlayerById" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "GET /players/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.getPlayerById.id}"
}

resource "aws_lambda_permission" "apigw_getPlayers" {
  statement_id  = "AllowAPIGatewayInvokeGetPlayers"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.getPlayers.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}

resource "aws_lambda_permission" "apigw_getPlayerById" {
  statement_id  = "AllowAPIGatewayInvokeGetPlayerById"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.getPlayerById.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http.id
  name        = "$default"
  auto_deploy = true
}

output "http_api_endpoint" {
  value       = aws_apigatewayv2_api.http.api_endpoint
  description = "HTTP API endpoint"
}


