module.exports = function (RED) {
    function MyEnergiAPIConfigNode(n) {
        RED.nodes.createNode(this, n);

        this.myenergi = 'hello world';
        this.hubSerial = n.hubSerial;
        this.APIKey = this.credentials.APIKey;
        const ME = require('myenergi-api')

        if (this.APIKey && this.hubSerial) {
            this.myenergi = new ME.MyEnergi(this.hubSerial, this.APIKey);

        }

    }
    RED.nodes.registerType("myenergi-api", MyEnergiAPIConfigNode, {
        credentials: {
            APIKey: { type: "password" }
        }
    });
}