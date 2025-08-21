resource "aws_dynamodb_table" "players" {
  name         = "${local.project_name}-players"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"
  range_key    = "sk"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  attribute {
    name = "gsi1pk"
    type = "S"
  }

  attribute {
    name = "gsi1sk"
    type = "S"
  }

  global_secondary_index {
    name            = "GSI1"
    hash_key        = "gsi1pk"
    range_key       = "gsi1sk"
    projection_type = "ALL"
  }

  # Optional uniqueness check index
  attribute {
    name = "gsi2pk"
    type = "S"
  }

  global_secondary_index {
    name            = "GSI2"
    hash_key        = "gsi2pk"
    projection_type = "KEYS_ONLY"
  }
}

output "dynamodb_table_name" {
  value       = aws_dynamodb_table.players.name
  description = "DynamoDB table for players"
}


