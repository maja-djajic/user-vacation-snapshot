# User Vacation Snapshot

A serverless app to generate monthly vacation reports for users, built with:

- AWS CDK (TypeScript)
- Python AWS Lambda
- LocalStack + Docker Compose
- MySQL

## 📁 Project Structure

```text
user-vacation-snapshot/
│
├── cdk/                   # CDK stack and local deployment script (cdklocal)
│   ├── bin/
│   ├── lib/
│   ├── cdk-local.sh       # Shell script to export env vars and deploy locally
│   └── ...
│
├── lambda-function/       # Python Lambda source code + dependencies
│   ├── lambda_handler.py
│   ├── requirements.txt
│   └── package/           # Lambda deployment bundle (created manually)
│
├── local-infra/           # LocalStack & Docker Compose configuration
│   └── docker-compose.yaml
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js (for CDK)
- Python 3.13
- AWS CLI (`aws`)
- `cdklocal` helper: [setup guide](https://github.com/localstack/aws-cdk-local)

### Clone the repository

```bash
git clone https://github.com/maja-djajic/user-vacation-snapshot.git
cd user-vacation-snapshot
```

### Setup Python environment

```bash
cd lambda-function
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt --target package/
cp lambda_handler.py package/
```

### Start LocalStack

```bash
cd local-infra
docker-compose up -d
```

### Deploy locally with CDK
NOTE: By default the cron job for scheduler running the lambda is set on each minute. You can change it by changing env variable `REPORT_CRON` in `cdk-local.sh`.

```bash
cd cdk
chmod +x ./cdk-local.sh
./cdk-local.sh
```

### Cleanup
To cleanup cdklocal infra use the same script, but comment out `cdk destroy` as instructed in the script.

To cleanup LocalStack run `docker-compose down`.
