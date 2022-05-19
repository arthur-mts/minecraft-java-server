const AWS = require("aws-sdk")
const ec2Client = new AWS.EC2({
    region: 'sa-east-1'
})

let response;

exports.lambdaHandler = async (event, context) => {

    async function fetchInstanceData(params, instanceId) {
        let instances = (await ec2Client.describeInstances(params).promise()).Reservations
            .map((reservation) => reservation.Instances)
            .reduce(
                (acc, cur) => acc.concat(cur), []
            );

        return instances.find(i => i.InstanceId === instanceId);
    }

    try {
        const body = JSON.parse(event.body)
        const ec2Id = process.env.EC2_ID
        const status = body.status

        const params = {
            "InstanceIds": [
                ec2Id
            ]
        };

        let instanceData = await fetchInstanceData(params, ec2Id);
        if (instanceData === null) {
            throw Error("Wrong instance Id")
        }
        const instanceStatus = instanceData.State.Name

        switch (status) {
            case "ACTIVE":
                if (instanceStatus !== "stopped") {
                    throw Error("Can only ACTIVATE an STOPPED instance")
                }
                await ec2Client.startInstances(params).promise();
                break
            case "INACTIVE":
                if (instanceStatus !== "running") {
                    throw Error("Can only DEACTIVATE an RUNNING instance")
                }
                await ec2Client.stopInstances(params).promise();
                break
            default:
                throw Error("Invalid input")
        }
        response = {
            'statusCode': 200,
            'body': JSON.stringify(
                {
                    message: 'The instance is now: ' + status
                }
            )
        }
    } catch (err) {
        console.log(err);
        return {
            'statusCode': 500,
            body: JSON.stringify(err.message)
        };
    }

    return response
};
