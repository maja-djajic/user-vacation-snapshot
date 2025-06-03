#!/bin/bash

export DB_USER="root"
export DB_PASSWORD="root"
export DB_HOST="host.docker.internal"
export DB_NAME="vacation"

export AWS_S3_ENDPOINT="http://s3.us-east-1.localhost.localstack.cloud:4566"
export AWS_REGION="us-east-1"
export BUCKET_NAME="user-vacation-days"
export LAMBDA_PATH="../lambda-function/package"
export LAMBDA_HANDLER="lambda_handler.lambda_handler"

export ACCESS_KEY="test"
export SECRET_ACCESS_KEY="test"
export REPORT_CRON="cron(* * * * ? *)"

cdklocal bootstrap

cdklocal deploy --require-approval never

# to destroy, comment out commands above and uncomment this one below
# cdklocal destroy --require-approval never