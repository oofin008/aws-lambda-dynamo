import {APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

// case1: input only uuid, return random response
// case2: input uuid with timestamp, return random response
// case3: input uuid, timestamp and forceUpdate flag, return response to update

// unit test: 
// - should return 200 with content when there update
// - should return 201 no content, if no update required
// - should return 400, if uuid is not found or timestamp is wrong format

export const handler = async (event: APIGatewayProxyEventV2 ): Promise<APIGatewayProxyStructuredResultV2> => {
  const UUID = event.pathParameters?.UUID ?? undefined;
  const timeStamp = event.pathParameters?.timeStamp ?? undefined;
  const forceUpdate = event.pathParameters?.forceUpdate ?? undefined;

  if (!UUID) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "no uuid provide",
      })
    }
  }

  const result = await mockDB.find(UUID);
  if(!result) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "user not found",
      })
    }
  }

  // compare timestamp param with result
  const { updatedAt } = result;
  
  // never get config or need update
  if (!timeStamp || (timeStamp < updatedAt)) {
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    }
  } else {
    // no need to update
    return {
      statusCode: 201,
    }
  }
}

const mockDB = {
  find: (UUID: string) => {
    const date = new Date().toISOString();
    const mockJson = {
      CONFIATION_RATE: "2000",
    }
    if (UUID == "UUID-001") {
      return {
        updatedAt: date,
        configValue: JSON.stringify(mockJson),
      }
    } else {
      return undefined;
    }
  },
}