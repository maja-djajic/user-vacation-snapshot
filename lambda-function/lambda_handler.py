import os
import json
import boto3
import pymysql
from datetime import datetime


def lambda_handler(event, context):
    db_host = os.environ["DB_HOST"]
    db_user = os.environ["DB_USER"]
    db_password = os.environ["DB_PASSWORD"]
    db_name = os.environ["DB_NAME"]

    conn = pymysql.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        database=db_name
    )

    cursor = conn.cursor()
    cursor.execute("SELECT name, old_vacation_days, current_vacation_days FROM user")
    users = cursor.fetchall()

    csv_lines = ["name,old_vacation_days,current_vacation_days"]
    for name, old_vacation_days, current_vacation_days in users:
        csv_lines.append(f"{name},{old_vacation_days},{current_vacation_days}")
    csv_data = "\n".join(csv_lines)

    timestamp = datetime.utcnow().strftime("%Y-%m-%dT%H-%M")
    filename = f"monthly-user-report-{timestamp}.csv"

    s3_kwargs = {
        "aws_access_key_id": os.getenv("ACCESS_KEY"),
        "aws_secret_access_key": os.getenv("SECRET_ACCESS_KEY"),
        "region_name": os.getenv("AWS_REGION")
    }

    # override for localstack
    endpoint = os.getenv("AWS_ENDPOINT")
    if endpoint:
        s3_kwargs["endpoint_url"] = endpoint

    s3 = boto3.client("s3", **s3_kwargs)

    bucket = os.environ["BUCKET_NAME"]
    s3.put_object(Bucket=bucket, Key=filename, Body=csv_data.encode("utf-8"))

    return {
        "statusCode": 200,
        "body": f"Upload complete: {filename}"
    }
