terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
}

variable "shared_cred_file" {
 default = "/home/dimosian/.aws/credentials"
}

provider "aws" {
  region  = "us-west-2"
  profile = "default"
  shared_credentials_file = "${var.shared_cred_file}"
}

resource "aws_instance" "example" {
  ami           = "ami-00f9f4069d04c0c6e"
  instance_type = "t2.micro"
  key_name = "mykey"

  tags = {
    Name = "terraform Test Instance"
  }
}
