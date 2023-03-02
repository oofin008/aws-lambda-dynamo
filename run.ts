import express from 'express';
import AWS from 'aws-sdk';
import { handler } from './index';

const app = express();

AWS.config.update({
  region: 'localhost',
});

// Create a new instance of the DynamoDB client
const dynamoDB = new AWS.DynamoDB({ apiVersion: '2012-08-10', endpoint: 'http://localhost:8000'});

// scan operation in Dynamo is slow and cost expensive
// use query is cheaper, but can query rely on primary-key
// GSI (global secondary index) is another way to fetch

app.get('/getall', (req, res) => {
  const params: AWS.DynamoDB.ScanInput = {
    TableName: 'ShareConfig',
  };

  // Use the DynamoDB client to fetch data from the table
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching data from DynamoDB');
    } else {
      res.send(data);
    }
  });
});

app.post('/add', (req, res) => {
  const createParams = {
    TableName: 'ShareConfig',
    Item: {
      'PK': { S: 'some-partition-key-value' },
      'SK': { S: 'some-sort-key-value' },
      'attribute1': { S: 'some-attribute-value' },
      'attribute2': { N: '123' },
    },
  };
  
  dynamoDB.putItem(createParams, (err, data) => {
    if (err) {
      console.error(`Error creating item: ${err}`);
      res.status(500).json(err);
    } else {
      console.log(`Item created successfully: ${data}`);
      res.status(200).json('success');
    }
  });
});

app.get('/init', (req, res) => {
  const params: AWS.DynamoDB.CreateTableInput = {
    TableName: 'ShareConfig',
    KeySchema: [
      { AttributeName: 'HashKey', KeyType: 'HASH' }, // PK
      { AttributeName: 'UPId', KeyType: 'RANGE'}, // SK
    ],
    AttributeDefinitions: [
      { AttributeName: 'HashKey', AttributeType: 'S' },
      { AttributeName: 'UPId', AttributeType: 'S' },
      { AttributeName: 'ConfigValue', AttributeType: 'S' },
      { AttributeName: 'NLEId', AttributeType: 'S' },
      { AttributeName: 'LOCId', AttributeType: 'S' },
      { AttributeName: 'UserUuid', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  // Use the DynamoDB client to create the table
  dynamoDB.createTable(params, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json(err);
    } else {
      console.log('DynamoDB table created');
      res.status(200).json('create success');
    }
  });
})

app.delete('/clean', (req, res) => {
  const params: AWS.DynamoDB.DeleteTableInput = {
    TableName: "ShareConfig",
  }

  dynamoDB.deleteTable(params, (err, data) => {
    if (err) {
      console.error(`Error deleting table: ${err}`);
      res.sendStatus(500);
    } else {
      console.log(`Table deleted successfully: ${data}`);
      res.sendStatus(200);
    }
  });
});

// Start the Express app
app.listen(3000, () => {
  console.log('Express app listening on port 3000');
});
