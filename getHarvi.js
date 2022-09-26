
module.exports = function (RED) {

    function GetHarvi(config) {
        RED.nodes.createNode(this, config);
        this.server = RED.nodes.getNode(config.server);
        var node = this;
        const myenergi = this.server.myenergi

        node.on('input', async function (msg, send, done) {
            if (myenergi == null) {
                done('API Error, check credentials')
            }
            let harvi = {}
            if (msg.payload.serial) {
                harvi = await myenergi.getStatusHarvi(msg.payload.serial);

            } else {
                harvi = (await myenergi.getStatusHarviAll())[0];

            }

            this.status({ text: `Last Check: ${new Date(Date.now())}` });
            msg.payload = harvi;
            send(msg);
            done()

        });
    }
    RED.nodes.registerType("getHarvi", GetHarvi);
}