const { execSync } = require('child_process');
const aws = require('aws-sdk');
const path = require('path');
const fs = require('fs-extra');

var default_region = process.env.AWS_REGION || 'us-east-1';

async function deployCDK() {

  // project config file
  const callerIdentity = await new aws.STS().getCallerIdentity().promise();
  const aid = callerIdentity.Account;

  // 1. lambda execute path at /var/task but does not allow to create. Only /tmp can use.
  // 2. Without aws config file, CDK will through exceptions
  // https://github.com/aws/aws-cdk/blob/master/packages/aws-cdk/lib/api/util/sdk.ts#L325

  // setup aws config file.
  if (!fs.pathExistsSync(path.resolve('/tmp', '.aws', 'config'))) {
    var data = `
      [default]
      output = json
      region = ${default_region}
      `;
    fs.outputFileSync(path.resolve('/tmp', '.aws', 'config'), data);
  }

  // setup the credential file
  if (!fs.pathExistsSync(path.resolve('/tmp', 'credentials'))) {
    var data = `
      [default]
      aws_access_key_id=${aws.config.credentials.accessKeyId}
      aws_secret_access_key=${aws.config.credentials.secretAccessKey}
      `;
    fs.outputFileSync(path.resolve('/tmp', 'credentials'), data);
  }
  
  // 1. Set process.env.HOME Lambda default HOME is /home/usrXXX.
  // 2. Create a shared credetial file to let CDK deploy environment-agnostic.
  // https://docs.aws.amazon.com/cli/latest/topic/config-vars.html#the-shared-credentials-file
  // https://github.com/aws/aws-cdk/blob/master/packages/aws-cdk/lib/api/util/sdk.ts#L297
  var cmd = `
  export AWS_SHARED_CREDENTIALS_FILE='/tmp/credentials'
  export HOME='/tmp'
  ./node_modules/aws-cdk/bin/cdk deploy -v
  `;
  var result = execSync(cmd).toString();
  console.log(result);
}

exports.handler = (event, context, callback) => {
   deployCDK();
};
