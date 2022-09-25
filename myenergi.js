
module.exports = function(RED) {

      function MyEnergiNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        const ME = require('myenergi-api')
        const username = this.credentials.username;
        const password = this.credentials.password;
        const myenergi =  new ME.MyEnergi(this.credentials.username, this.credentials.password);

        node.on('input', async function(msg, send, done) {
            if(!username || !password){
                done('No Credentials')
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
    RED.nodes.registerType("myenergi",MyEnergiNode,{
        credentials: {
            username: {type:"text"},
            password: {type:"password"}
        }
    });
}