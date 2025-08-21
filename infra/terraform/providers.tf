provider "aws" {
  region = var.region
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

locals {
  project_name        = var.project_name
  normalized_domain   = replace(var.domain_name, ".", "-")
  site_bucket_name    = coalesce(var.site_bucket_name, "${local.project_name}-site-${local.normalized_domain}")
}


