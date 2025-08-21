resource "aws_cognito_user_pool" "this" {
  name = "${local.project_name}-user-pool"

  password_policy {
    minimum_length    = 8
    require_uppercase = false
    require_lowercase = false
    require_numbers   = true
    require_symbols   = false
  }

  username_attributes = ["email"]
  auto_verified_attributes = ["email"]
}

resource "aws_cognito_user_pool_client" "app" {
  name                         = "${local.project_name}-app-client"
  user_pool_id                 = aws_cognito_user_pool.this.id
  generate_secret              = false
  prevent_user_existence_errors = "ENABLED"
  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
  supported_identity_providers = ["COGNITO"]
  callback_urls                = ["https://${var.domain_name}", "https://www.${var.domain_name}"]
  logout_urls                  = ["https://${var.domain_name}", "https://www.${var.domain_name}"]

  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["openid", "email", "profile"]
}

resource "aws_cognito_user_group" "admin" {
  user_pool_id = aws_cognito_user_pool.this.id
  name         = "admin"
  description  = "Administrators with CRUD access"
}

output "cognito_user_pool_id" {
  value       = aws_cognito_user_pool.this.id
  description = "Cognito User Pool ID"
}

output "cognito_app_client_id" {
  value       = aws_cognito_user_pool_client.app.id
  description = "Cognito App Client ID"
}

resource "aws_cognito_user_pool_domain" "this" {
  domain       = "${local.project_name}-${local.normalized_domain}"
  user_pool_id = aws_cognito_user_pool.this.id
}

output "cognito_user_pool_domain" {
  value       = "https://${aws_cognito_user_pool_domain.this.domain}.auth.${var.region}.amazoncognito.com"
  description = "Cognito hosted UI domain URL"
}


