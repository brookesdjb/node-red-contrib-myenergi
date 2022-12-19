module.exports = function (RED) {
    const { ZappiBoostMode } = require("myenergi-api");

    function SetZappiBoostMode(config) {
        RED.nodes.createNode(this, config);
        this.server = RED.nodes.getNode(config.server);
        const myenergi = this.server.myenergi;

        this.on("input", async (msg) => {
            if (myenergi == null) {
                const text = "API Error, check credentials";
                this.status({ text, fill: "red" });
                return this.error(text);
            }

            const boostMode = ZappiBoostMode[msg.payload.boostMode];
            if (!boostMode) {
                const text = `You must set msg.payload.boostMode to one of [Manual, Smart, Stop].`;
                this.status({ text, fill: "red" });
                return this.error(text);
            }

            if (boostMode === ZappiBoostMode.Smart && !msg.payload.completeTime) {
                const text =
                    "Smart boost mode requires a completion time to be set in msg.payload.completeTime";
                this.status({ text, fill: "red" });
                return this.error(text, msg);
            }

            const boostKwh = msg.payload.boostKwh || 99;

            let serial = msg.payload.serial;
            if (!serial) {
                const zappiAll = await myenergi.getStatusZappiAll();
                serial = zappiAll[0].sno;
            }

            const payload = await myenergi.setZappiBoostMode(
                +serial,
                boostMode,
                +boostKwh,
                msg.payload.completeTime
            );
            if (payload?.status !== 0) {
                this.status({
                    text: `Boost failed - status [${payload?.status}] text [${payload?.statustext}]`,
                    fill: "red",
                });
            } else {
                this.status({
                    text: `Boost mode set to [${msg.payload.boostMode}]`,
                    fill: "green",
                });
            }

            return this.send({ payload });
        });
    }
    RED.nodes.registerType("setZappiBoostMode", SetZappiBoostMode);
};
