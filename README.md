# Execute CDK in AWS Lambda

## File and Folder Structure

### cdk.json

must add auto complete for deployment.

```
{
  "app": "node cdkInit/create-s3-bucket.js",
  "requireApproval": "never"
}
```

* Need to change cdk output path because lambda environment only allow to write in tmp.

```
Error: EROFS: read-only file system, open 'cdk.out/tree.json'
@aws-cdk/core/lib/private/tree-metadata.js:50:12)
```

### package.json

* define the run scripts for CDK execution.
```
  "scripts": {
    "setup": "npm install",
    "list": "./node_modules/aws-cdk/bin/cdk list",
    "cdk": "./node_modules/aws-cdk/bin/cdk",
    "deploy": "./node_modules/aws-cdk/bin/cdk deploy",
    "synth": "./node_modules/aws-cdk/bin/cdk synth --output synth",
    "destroy": "./node_modules/aws-cdk/bin/cdk destroy"
  }
```

* define the cdk related packages
```
  "devDependencies": {
    "aws-cdk": "^1.18.0"
  },
  "dependencies": {
    "@aws-cdk/core": "^1.18.0",
    "@aws-cdk/aws-s3": "^1.18.0",
    "source-map-support": "^0.5.16"
  }
```

## Testing in local

Remember to set the lambda timeout to 900 seconds.

* `npm install`
* `npm run list`
```
npm run list

> cdk_in_lambda@0.1.0 list /home/ec2-user/environment/cdk-in-lambda
> ./node_modules/aws-cdk/bin/cdk list

s3Stack
```