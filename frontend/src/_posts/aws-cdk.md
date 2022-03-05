---
title: "Easily provision your cloud infrastructure as code with AWS CDK"
excerpt: "Learn how to use CDK to deploy your cloud application resources with familiar programming languages like TypeScript and Python"
date: "2020-03-16T05:35:07.322Z"
author:
  name: Spencer Mehta
---

The AWS Cloud Development Kit (CDK) is a framework that lets you define your cloud application resources using familiar programming languages such as TypeScript and Python. This allows developers familiar with these languages to apply their existing knowledge and get to grips with building cloud infrastructure rapidly, by using provided high-level components built with best practices as defaults.

CDK also adopts the paradigm of 'constructs', which allow you to wrap specific resource provisionment into a simple, reusable package. CDK additionally provides libraries to write assertion and validation tests with familiar testing tools such as `jest`!

We'll now take a look at a small demo project creating a REST API with one endpoint. You can follow along with the project at the repository [here](https://github.com/spencermehta/cdk-demo).

## Installation

A pre-requisite is to have the AWS CLI installed and configured with an appropriate account. Once you've done this, you can install CDK using `npm i -g cdk` - this will install it globally on your machine.

We’re going to start a new project from scratch using CDK’s TypeScript template. Create a new `cdk-demo` directory and execute `cdk init app --language typescript` inside it. You can browse the state of the repo at this point in the `step1` branch.

## The basics

There are a couple main files to go over here. Firstly, `lib/cdk-demo-stack.ts` creates our first CDK stack. A stack corresponds to a CloudFormation template, which provisions the resources needed for our applications and services.

```ts
// lib/cdk-demo-stack.ts

import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkDemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }
}
```

Next we have `bin/cdk-demo.ts`, which defines our CDK app. An app can contain multiple stacks, and modularising our services into stacks decouples their deployments.

```ts
// bin/cdk-demo.ts

#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CdkDemoStack } from "../lib/cdk-demo-stack";

const app = new cdk.App();
new CdkDemoStack(app, "CdkDemoStack", {});
```

You can see we initialise our `CdkDemoStack` in this file. Here we can also set deployment configuration such as the AWS acccount and region to deploy the stack and make this vary by environment.

As an example let's set the deployment region to `eu-west-1` to benefit from the low Irish tax rates by adding the line: `env: { region: 'eu-west-1' }`.

We'll now see how easy it is to provision resources by creating a simple Lambda function that we can access through an API Gateway endpoint.

## Creating a Lambda

Let's first create a `lambdas` directory to store our code. Inside this we'll create `getLunchSpots.ts` containing the following:

```ts
import { APIGatewayProxyResult } from "aws-lambda";

const lunchSpots = [
  {
    name: "Papaya",
    rating: 10,
  },
];

export const handler = async (): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify(lunchSpots),
  };
};
```

This creates a simple handler that returns a 200 response with the serialised `lunchSpots` object, a response very typical of some sort of API.

## Adding to the Stack

Now we'll create a Lambda resource in our stack directly from our TypeScript handler function (we don't need to worry about compiling TS to JS ourselves as the CDK construct handles this!). Add the following code to the stack file:

```ts
const getLunchSpotsLambda = new NodejsFunction(this, "getLunchSpots", {
  handler: "handler",
  entry: path.join(__dirname, "/../lambdas/getLunchSpots.ts"),
});
```

This creates a Node.js Lambda function with the name 'getLunchSpots', using the `handler` function found in `lambdas/getLunchSpots.ts`. As we want to make this an endpoint in our REST API we're going to create an integration resource for our Lambda:

```ts
const getLunchSpotsIntegration = new LambdaIntegration(getLunchSpotsLambda);
```

We'll then add an API Gateway API resource to our `CdkDemoStack`:

```ts
const api = new RestApi(this, "sohoLunchSpots", {
  restApiName: "Soho Lunch Spots",
});
```

and create a resource for our `lunchSpots` with a GET method to access our Lambda function:

```ts
const lunchSpots = api.root.addResource("lunch-spots");
lunchSpots.addMethod("GET", getLunchSpotsIntegration);
```

The `addResource` function adds a new endpoint definition to the API, and the `addMethod` function defines the mapping of this endpoint on a type of request, in this case to our Lambda function integration.

The state of the repo after these changes can be seen in the `step2` branch.

## Deployment

We'll now go over how to deploy the resources we've provisioned in the above code. If this is your first time deploying with CDK to the `eu-west-1` region on your account, you'll need to 'bootstrap' your account on this region. Bootstrapping provisions resources that CDK needs to perform the deployment, e.g. an S3 bucket for storing files. You can bootstrap your account by running `cdk bootstrap`.

CDK apps are a definition of our infrastructure as code, rather than the infrastructure as code itself. Upon deployment, they are 'synthesised' into an AWS CloudFormation template for each stack in the app. You can see what these templates look like by executing `cdk synth`.

Another handy CDK feature is the `cdk diff` command. It allows us to view the difference between the currently deployed CloudFormation templates and the template equivalent to the current state of our local CDK code.

To deploy our changes, we can simply run `cdk deploy`. You may get a prompt asking to enter 'y' to confirm deployment of the changes. Near the end of the deployment script's terminal output you should see an 'Outputs' section with an entry 'CdkDemoStack.sohoLunchSpotsEndpoint...'. This is the endpoint of our API Gateway API. If we make a GET request to this url + `/lunch-spots`, we'll see the JSON object we specified in our Lambda function returned.

## Testing

We'll also add a short test to make sure our Lambda function was created as expected. Open up `test/cdk-demo.test.ts` and change the code to the following:

```ts
test('Lambda function created', () => {
   const app = new cdk.App();

   const stack = new CdkDemo.CdkDemoStack(app, 'MyTestStack');

   const template = Template.fromStack(stack);

   template.hasResourceProperties('AWS::Lambda::Function', {
	 Handler: 'index.handler',
	 Runtime: 'nodejs14.x'
   });
```

This test creates a template from our stack and performs and assertion test on the template to ensure it has a Lambda function with a handler `index.handler` and a runtime of `Node.js 14`. You can browse the current state of the repo in the `step3` branch.

## Summary

And that's it! In just a few lines of code we've created, provisioned, deployed, and tested a service on scalable cloud infrastructure!
