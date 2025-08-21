resource "aws_s3_bucket" "tf_state" {
  count         = var.tf_state_bucket == null ? 0 : 1
  bucket        = var.tf_state_bucket
  force_destroy = false
}

resource "aws_s3_bucket_versioning" "tf_state" {
  count  = var.tf_state_bucket == null ? 0 : 1
  bucket = aws_s3_bucket.tf_state[0].id
  versioning_configuration { status = "Enabled" }
}

resource "aws_dynamodb_table" "tf_lock" {
  count        = var.tf_state_table == null ? 0 : 1
  name         = var.tf_state_table
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"
  attribute { name = "LockID" type = "S" }
}


