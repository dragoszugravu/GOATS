variable "project_name" {
  description = "Project name prefix for resources"
  type        = string
  default     = "goats"
}

variable "region" {
  description = "AWS region for primary resources"
  type        = string
  default     = "eu-west-1"
}

variable "domain_name" {
  description = "Apex domain (e.g., fg-goats.com)"
  type        = string
}

variable "hosted_zone_id" {
  description = "Existing Route53 Hosted Zone ID for domain_name (required only at cutover)"
  type        = string
  default     = null
}

variable "site_bucket_name" {
  description = "Optional explicit S3 bucket name for the site"
  type        = string
  default     = null
}

variable "price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"
}

variable "manage_custom_domain" {
  description = "Manage ACM/aliases/Route53 for custom domain. Set true only at cutover."
  type        = bool
  default     = false
}

variable "logs_retention_days" {
  description = "CloudWatch Logs retention in days"
  type        = number
  default     = 14
}

variable "github_owner" {
  description = "GitHub organization or user for OIDC trust"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name for OIDC trust"
  type        = string
}

variable "github_branch" {
  description = "Git branch to allow for OIDC (e.g., main)"
  type        = string
  default     = "main"
}

variable "attach_admin_policy" {
  description = "Attach AdministratorAccess to the deploy role (bootstrap only)"
  type        = bool
  default     = true
}

variable "create_github_oidc_provider" {
  description = "Create the GitHub OIDC provider in this account if missing"
  type        = bool
  default     = false
}

variable "tf_state_bucket" {
  description = "S3 bucket for Terraform remote state"
  type        = string
  default     = null
}

variable "tf_state_table" {
  description = "DynamoDB table for Terraform state locking"
  type        = string
  default     = null
}


