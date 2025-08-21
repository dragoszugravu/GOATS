output "site_bucket_name" {
  description = "S3 bucket name for the site"
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  description = "CloudFront domain name"
  value       = aws_cloudfront_distribution.site.domain_name
}

output "api_base_url" {
  description = "HTTP API base URL"
  value       = aws_apigatewayv2_api.http.api_endpoint
}


