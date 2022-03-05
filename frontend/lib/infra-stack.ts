import { NextJSLambdaEdge } from "@sls-next/cdk-construct";
import { Stack, StackProps, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    console.log(process.env.DOMAIN_CERTIFICATE_ARN);
    new NextJSLambdaEdge(this, "SpencerPortfolio", {
      serverlessBuildOutDir: "./build",
      runtime: Runtime.NODEJS_14_X,
      memory: 1024,
      timeout: Duration.seconds(30),
      withLogging: true,
      name: {
        apiLambda: `${id}Api`,
        defaultLambda: `Fn${id}`,
        imageLambda: `${id}Image`,
      },
      domain: {
        domainNames: ["spencermehta.com"],
        certificate: Certificate.fromCertificateArn(
          this,
          "Cert",
          process.env.DOMAIN_CERTIFICATE_ARN ?? ""
        ),
      },
    });
  }
}
