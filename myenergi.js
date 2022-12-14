
module.exports = function (RED) {

    function MyEnergiNode(config) {
        RED.nodes.createNode(this, config);
        this.server = RED.nodes.getNode(config.server);
        var node = this;
        const myenergi = this.server.myenergi

        node.on('input', async function (msg, send, done) {
            if (myenergi == null) {
                done('API Error, check credentials')
            }
                const statusAll = await myenergi.getStatusAll();
                msg.payload = statusAll;
                this.status({text: `Last Check: ${new Date(Date.now())}`});

                send(msg);
        
            done()
        });
    }
    RED.nodes.registerType("myenergi", MyEnergiNode);
}