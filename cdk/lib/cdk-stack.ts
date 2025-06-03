import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as logs from "aws-cdk-lib/aws-logs";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const logGroup = new logs.LogGroup(this, "LambdaLogGroup", {
      logGroupName: `/aws/lambda/VacationReportLambda`,
      retention: logs.RetentionDays.ONE_YEAR,
    });

    const bucket = new s3.Bucket(this, "VacationReportBucket", {
      bucketName: process.env.BUCKET_NAME,
    });

    const fn = new lambda.Function(this, "VacationReportLambda", {
      runtime: lambda.Runtime.PYTHON_3_13,
      code: lambda.Code.fromAsset(process.env.LAMBDA_PATH || ""),
      handler: process.env.LAMBDA_HANDLER || "",
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      logGroup: logGroup,
      environment: {
        BUCKET_NAME: bucket.bucketName,
        DB_USER: process.env.DB_USER || "",
        DB_PASSWORD: process.env.DB_PASSWORD || "",
        DB_HOST: process.env.DB_HOST || "",
        DB_NAME: process.env.DB_NAME || "",
        ACCESS_KEY: process.env.ACCESS_KEY || "",
        SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY || "",
        ...(process.env.AWS_ENDPOINT
          ? { AWS_ENDPOINT: process.env.AWS_ENDPOINT }
          : {}),
      },
    });

    bucket.grantWrite(fn);

    const rule = new events.Rule(this, "MonthlyTrigger", {
      schedule: events.Schedule.expression(process.env.REPORT_CRON || ""),
    });

    rule.addTarget(new targets.LambdaFunction(fn));
  }
}
