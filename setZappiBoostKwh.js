module.exports = function (RED) {
    function SetZappiBoostKwh(config) {
        RED.nodes.createNode(this, config);
        this.server = RED.nodes.getNode(config.server);
        const node = this;
        const myenergi = this.server.myenergi;

        const boost = async (zappiSerialNumber, boostKwh) => {
            const result = await myenergi.setZappiBoostMode(
                +zappiSerialNumber,
                ZappiBoostMode.Manual,
                +boostKwh
            );
            if (result?.status !== 0) {
                this.status({
                    text: `Boost failed - status [${result?.status}] text [${result?.statustext}]`,
                    fill: "red",
                });
            } else {
                this.status({ text: `Boosting ${boostKwh}kWh`, fill: "green" });
            }
        };

        node.on("input", async function (msg, send, done) {
            if (myenergi == null) {
                const text = "API Error, check credentials";
                this.status({ text, fill: "red" });
                return done(text);
            } else if (!msg.payload.boostKwh) {
                const text = "Must set msg.payload.boostKwh to a +ve value";
                this.status({ text, fill: "red" });
                return done(text);
            }

            if (msg.payload.zappiSerialNumber) {
                await boost(msg.payload.zappiSerialNumber, msg.payload.boostKwh);
                return done();
            }

            const zappiAll = await myenergi.getStatusZappiAll();
            if (zappiAll?.length !== 1) {
                const text = `[${zappiAll?.length}] zappi chargers found. You must set msg.payload.zappiSerialNumber.`;
                this.status({ text, fill: "red" });
                return done(text);
            }

            await boost(zappiAll[0].sno, msg.payload.boostKwh);
            done();
        });
    }
    RED.nodes.registerType("setZappiBoostKwh", SetZappiBoostKwh);
};
