resource "aws_vpc" "eks_vpc" {
    cidr_block = "10.0.0.0/16"

    tags = {
        Name = "${var.cluster_name}-vpc"
    }
}

resource "aws_subnet" "eks_subnets" {
    count = 2

    vpc_id            = aws_vpc.eks_vpc.id
    cidr_block        = cidrsubnet(aws_vpc.eks_vpc.cidr_block, 8, count.index)
    availability_zone = data.aws_availability_zones.available.names[count.index]

    tags = {
        Name = "${var.cluster_name}-subnet-${count.index}"
    }
}

data "aws_availability_zones" "available" {}

resource "aws_eks_cluster" "cluster" {
    name     = var.cluster_name
    role_arn = aws_iam_role.eks_cluster_role.arn

    vpc_config {
        subnet_ids = aws_subnet.eks_subnets[*].id
    }

    depends_on = [
        aws_iam_role_policy_attachment.eks_cluster_AmazonEKSClusterPolicy,
        aws_iam_role_policy_attachment.eks_cluster_AmazonEKSVPCResourceController,
    ]
}

resource "aws_iam_role" "eks_cluster_role" {
    name = "${var.cluster_name}-role"

    assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Action = "sts:AssumeRole"
                Effect = "Allow"
                Principal = {
                    Service = "eks.amazonaws.com"
                }
            }
        ]
    })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_AmazonEKSClusterPolicy" {
    policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
    role       = aws_iam_role.eks_cluster_role.name
}

resource "aws_iam_role_policy_attachment" "eks_cluster_AmazonEKSVPCResourceController" {
    policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
    role       = aws_iam_role.eks_cluster_role.name
}