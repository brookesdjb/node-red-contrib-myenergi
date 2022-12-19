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

            let zappiSerialNumber = msg.payload.zappiSerialNumber;
            if (!zappiSerialNumber) {
                const zappiAll = await myenergi.getStatusZappiAll();
                if (zappiAll?.length !== 1) {
                    const text = `[${zappiAll?.length}] zappi chargers found. You must set msg.payload.zappiSerialNumber to choose one.`;
                    this.status({ text, fill: "red" });
                    return this.error(text, msg);
                }

                zappiSerialNumber = zappiAll[0].sno;
            }

            const chargeMode = ZappiChargeMode[msg.payload.zappiChargeMode];
            if (!chargeMode) {
                const text = `You must set msg.payload.zappiChargeMode to one of [Fast, Eco, EcoPlus, Off].`;
                this.status({ text, fill: "red" });
                return this.error(text);
            }

            const payload = await myenergi.setZappiChargeMode(+zappiSerialNumber, chargeMode);
            if (payload?.status !== 0) {
                this.status({
                    text: `Set charge mode failed - status [${payload?.status}] text [${payload?.statustext}]`,
                    fill: "red",
                });
            } else {
                this.status({
                    text: `Charge mode set to [${msg.payload.zappiChargeMode}]`,
                    fill: "green",
                });
            }

            return this.send({ payload });
        });
    }

    RED.nodes.registerType("setZappiChargeMode", setZappiChargeMode);
};
