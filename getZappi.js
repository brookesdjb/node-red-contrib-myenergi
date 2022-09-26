
module.exports = function (RED) {

    function GetZappi(config) {
        RED.nodes.createNode(this, config);
        this.server = RED.nodes.getNode(config.server);
        var node = this;
        const myenergi = this.server.myenergi

        node.on('input', async function (msg, send, done) {
            if (myenergi == null) {
                done('API Error, check credentials')
            }
            let zappi = {}
            if(msg.payload.serial){
                zappi = await myenergi.getStatusZappi(msg.payload.serial);

            }else{
                zappi = (await myenergi.getStatusZappiAll())[0];

            }

            this.status({text: `Last Check: ${new Date(Date.now())}`});
            msg.payload = zappi;
            send(msg);
            done()
            
        });
    }
    RED.nodes.registerType("getZappi", GetZappi);
}