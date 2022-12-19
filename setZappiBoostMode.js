module.exports = function (RED) {
    const { ZappiBoostMode } = require("myenergi-api");

    function setZappiBoostMode(config) {
        RED.nodes.createNode(this, config);
        this.server = RED.nodes.getNode(config.server);
        const myenergi = this.server.myenergi;

        this.on("input", async (msg) => {
            if (myenergi == null) {
                const text = "API Error, check credentials";
                this.status({ text, fill: "red" });
                return this.error(text);
            }

            const boostMode = ZappiBoostMode[msg.payload.zappiBoostMode];
            if (!boostMode) {
                const text = `You must set msg.payload.zappiBoostMode to one of [Manual, Smart, Stop].`;
                this.status({ text, fill: "red" });
                return this.error(text);
            }

            if (boostMode === ZappiBoostMode.Smart && !msg.payload.zappiBoostCompleteTime) {
                const text =
                    "Smart boost mode requires a completion time to be set in msg.payload.zappiBoostCompleteTime";
                this.status({ text, fill: "red" });
                return this.error(text, msg);
            }

            const boostKwh = msg.payload.boostKwh || 99;

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

            const payload = await myenergi.setZappiBoostMode(
                +zappiSerialNumber,
                boostMode,
                +boostKwh,
                msg.payload.zappiBoostCompleteTime
            );
            if (payload?.status !== 0) {
                this.status({
                    text: `Boost failed - status [${payload?.status}] text [${payload?.statustext}]`,
                    fill: "red",
                });
            } else {
                this.status({
                    text: `Boost mode set to [${msg.payload.zappiBoostMode}]`,
                    fill: "green",
                });
            }

            return this.send({ payload });
        });
    }
    RED.nodes.registerType("setZappiBoostMode", setZappiBoostMode);
};
