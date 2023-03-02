# Dev AWS Lambda + DynamoDB on local

aws command
put --endpoint http://localhost:8000 to every command relate to dynamodb

```
aws dynamodb list-tables --endpoint-url http://localhost:8000
aws dynamodb delete-table --table-name ShareConfig --endpoint-url http://localhost:8000
```

```
aws configure
```
config value
Access Key ID: ACCESS_KEY
Secret Access Key: SECRET
Region: localhost
output format: json

```
cat ~/.aws/config
```

## Docker command

build and run container with detach
```
docker compose up -d
```

## DynamoDB Attribute type
S (string)
N (number)
B (binary data)
BOOL (Boolean)
SS (string set)
NS (number set)
BS (binary set)
M (map) - object
L (list) - array

## DynamoDB Key Type 
HASH (partition key)
RANGE (sort key)
