// tests/calculator.spec.tx
import { assert, expect } from "chai";
import { handler } from "..";

describe("Calculator Tests", () => {
  it("should return 200, if new config available", async () => {
    const pathParams = {
      UUID: "UUID-001",
    };
    const result = await handler({pathParameters: pathParams} as any);
    expect(result.statusCode).to.equal(200);
  });

  it("should return 200, if update config available", async () => {
    const oldTime = new Date(Date.now() - (1e+10)).toISOString();
    const pathParams = {
      UUID: "UUID-001",
      timeStamp: oldTime
    };
    const result = await handler({pathParameters: pathParams} as any);
    expect(result.statusCode)
  });

  it("should return 201 no content, if no update required", async () => {
    const pathParams = {
      UUID: "UUID-001",
      timeStamp: "2023-01-01",
    }
    const result = await handler({pathParameters: pathParams} as any);
    expect(result.statusCode).to.equal(201);
  });

  it("should return 400, if uuid is not provided", async () => {
    const result = await handler({} as any);
    const { message } = JSON.parse(result.body as any);
    expect(result.statusCode).to.equal(400);
    expect(message).to.equal("no uuid provide");
  });

  it("should return 500, if uuid is not found", async () => {
    const pathParams = {
      UUID: "not-uuid"
    }
    const result = await handler({ pathParameters: pathParams} as any);
    const { message } = JSON.parse(result.body as any);
    expect(result.statusCode).to.equal(500);
    expect(message).to.equal("user not found");
  });

});

