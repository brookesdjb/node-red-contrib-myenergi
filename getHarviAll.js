
module.exports = function (RED) {

    function GetHarviAll(config) {
        RED.nodes.createNode(this, config);
        this.server = RED.nodes.getNode(config.server);
        var node = this;
        const myenergi = this.server.myenergi

        node.on('input', async function (msg, send, done) {
            if (myenergi == null) {
                done('API Error, check credentials')
            }
            const harviAll = await myenergi.getStatusHarviAll();
            this.status({text: `Last Check: ${new Date(Date.now())}`});
            msg.payload = harviAll;
            send(msg);
            done()
            
        });
    }
    RED.nodes.registerType("getHarviAll", GetHarviAll);
}