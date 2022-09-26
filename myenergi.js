
module.exports = function(RED) {

      function MyEnergiNode(config) {
        RED.nodes.createNode(this,config);
        this.server = RED.nodes.getNode(config.server);

        var node = this;
   
        const myenergi = this.server.myenergi
        // this.status({text: this.name)};

        node.on('input', async function(msg, send, done) {
if(myenergi == null){
    done('API Error, check credentials')
}
            if(!msg.product){
                const statusAll = await myenergi.getStatusAll();
                msg.payload = statusAll;
                send(msg);
            }
            
            const product = msg.product

            switch(product){
                case "zappi":
                    if(msg.serial){
                        const statusZappi = await myenergi.getStatusZappi(msg.serial);
                        msg.payload = statusZappi;
                        send(msg);
                    }else{
                        const zappiAll = await myenergi.getStatusZappiAll();
                        msg.payload = zappiAll;
                        send(msg);
                    }
                    break;

            }
            const zappiAll = await myenergi.getStatusZappiAll();
          done()
        });
    }
    RED.nodes.registerType("myenergi",MyEnergiNode);
}