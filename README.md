# Execute CDK in AWS Lambda

## File and Folder Structure

### cdk.json

must add auto complete for deployment. And change the cdk output meta data path.

```
{
  "app": "node cdkInit/create-s3-bucket.js",
  "output": "/tmp/cdk.out",
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

* run SAM in local, it will trigger deploy.

```
sam local invoke cdkInit --no-event
```

  If encounter error, check your ~/.aws/creditial. Most of cases are related to your IAM access rights.

* You can deploy the code to AWS lambda environment

## Run in AWS Lambda environment

* Please give lambda execution role with policies: `AWSCloudFormation*` and `AmazonS3*`

* The key points are at lambda [index.js](./cdkInit/index.js)

* create aws config at `/tmp/.aws/config`, creditials at `/tmp/credentials`. 
* change the lambda execution environment variables:

```
  export AWS_SHARED_CREDENTIALS_FILE='/tmp/credentials'
  export HOME='/tmp'
```

* The credentials must get from STS. Otherwise, you will get secret error messages.

