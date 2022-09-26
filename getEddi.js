
module.exports = function (RED) {

    function GetEddi(config) {
        RED.nodes.createNode(this, config);
        this.server = RED.nodes.getNode(config.server);
        var node = this;
        const myenergi = this.server.myenergi

        node.on('input', async function (msg, send, done) {
            if (myenergi == null) {
                done('API Error, check credentials')
            }
            let eddi = {}
            if (msg.payload.serial) {
                eddi = await myenergi.getStatusEddi(msg.payload.serial);

            } else {
                eddi = (await myenergi.getStatusEddiAll())[0];

            }

            this.status({ text: `Last Check: ${new Date(Date.now())}` });
            msg.payload = eddi;
            send(msg);
            done()

        });
    }
    RED.nodes.registerType("getEddi", GetEddi);
}