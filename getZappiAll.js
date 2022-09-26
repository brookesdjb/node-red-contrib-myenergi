
module.exports = function (RED) {

    function GetZappiAll(config) {
        RED.nodes.createNode(this, config);
        this.server = RED.nodes.getNode(config.server);
        var node = this;
        const myenergi = this.server.myenergi

        node.on('input', async function (msg, send, done) {
            if (myenergi == null) {
                done('API Error, check credentials')
            }
            const zappiAll = await myenergi.getStatusZappiAll();
            this.status({text: `Last Check: ${new Date(Date.now())}`});
            msg.payload = zappiAll;
            send(msg);
            done()
            
        });
    }
    RED.nodes.registerType("getZappiAll", GetZappiAll);
}