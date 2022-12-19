module.exports = function (RED) {
    const { ZappiChargeMode } = require("myenergi-api");

    function setZappiChargeMode(config) {
        RED.nodes.createNode(this, config);
        this.server = RED.nodes.getNode(config.server);
        const myenergi = this.server.myenergi;

        this.on("input", async (msg) => {
            if (myenergi == null) {
                const text = "API Error, check credentials";
                this.status({ text, fill: "red" });
                return this.error(text);
            }

            const chargeMode = ZappiChargeMode[msg.payload.chargeMode];
            if (!chargeMode) {
                const text = `You must set msg.payload.chargeMode to one of [Fast, Eco, EcoPlus, Off].`;
                this.status({ text, fill: "red" });
                return this.error(text);
            }

            let serial = msg.payload.serial;
            if (!serial) {
                const zappiAll = await myenergi.getStatusZappiAll();
                serial = zappiAll[0].sno;
            }

            const payload = await myenergi.setZappiChargeMode(+serial, chargeMode);
            if (payload?.status !== 0) {
                this.status({
                    text: `Set charge mode failed - status [${payload?.status}] text [${payload?.statustext}]`,
                    fill: "red",
                });
            } else {
                this.status({
                    text: `Charge mode set to [${msg.payload.chargeMode}]`,
                    fill: "green",
                });
            }

            return this.send({ payload });
        });
    }

    RED.nodes.registerType("setZappiChargeMode", setZappiChargeMode);
};
