import { Builder } from "@sls-next/lambda-at-edge";
import * as cdk from "aws-cdk-lib";

import { InfraStack } from "../lib/infra-stack";

const builder = new Builder(".", "./build", {
  args: ["build"],
  cmd: "node_modules/.bin/next",
});

builder
  .build(true)
  .then(() => {
    const app = new cdk.App();

    return new InfraStack(app, "PortfolioStack", {
      env: {
        region: "us-east-1",
      },
      analyticsReporting: true,
      description: "Testing deploying NextJs serverless construct",
    });
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
