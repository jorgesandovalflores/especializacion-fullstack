terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # backend "s3" {
  #   bucket         = "login-cloud-tfstate"
  #   key            = "stg/aws/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "login-cloud-tf-locks"
  #   encrypt        = true
  # }
}
