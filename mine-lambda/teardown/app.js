const AWS = require("aws-sdk")
var ec2Client = new AWS.EC2({
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
        const ec2Id = process.env.EC2_ID
        const hoursToShutdown = process.env.MAX_HOURS

        const params = {
            "InstanceIds": [
                ec2Id
            ]
        };

        let instanceData = await fetchInstanceData(params, ec2Id);

        const instanceStatus = instanceData.State.Name
        const launchDateTime = new Date(instanceData.LaunchTime);
        const todayDateTime = new Date();

        let message = "instance is not running";
        if (instanceStatus === "ACTIVE" && Math.abs(todayDateTime - launchDateTime) / 36e5 > hoursToShutdown) {
            await ec2Client.stopInstances(params).promise();
            message = "instance stopped";
            //TODO: Notify to discord that instance has shutdown
        }

        response = {
            statusCode: 200,
            body: message
        }
    } catch (err) {
        console.log(err);
        return {
            'statusCode': 500,
            body: JSON.stringify(err.message)
        };
    }

    return response
}
