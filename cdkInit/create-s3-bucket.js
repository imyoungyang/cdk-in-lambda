const cdk = require("@aws-cdk/core");
const s3 = require("@aws-cdk/aws-s3");

//stack
class s3Stack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
		new s3.Bucket(this, 'beyoung-cdk-s3');
    }
}

const app = new cdk.App();
new s3Stack(app, 's3Stack');