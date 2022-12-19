module.exports = function (RED) {
    const { ZappiBoostMode } = require("myenergi-api");

    function setZappiBoostMode(config) {
        RED.nodes.createNode(this, config);
        this.server = RED.nodes.getNode(config.server);
        const myenergi = this.server.myenergi;

        const boost = async (zappiSerialNumber, zappiBoostMode, boostKwh, completeTime) => {
            const result = await myenergi.setZappiBoostMode(
                +zappiSerialNumber,
                zappiBoostMode,
                boostKwh,
                completeTime
            );
            if (result?.status !== 0) {
                this.status({
                    text: `Boost failed - status [${result?.status}] text [${result?.statustext}]`,
                    fill: "red",
                });
            } else {
                this.status({ text: `Boosting ${boostKwh}kWh`, fill: "green" });
            }
            return result;
        };

        this.on("input", async (msg) => {
            if (myenergi == null) {
                const text = "API Error, check credentials";
                this.status({ text, fill: "red" });
                return this.error(text);
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

            if (msg.payload.zappiBoostMode?.toLowerCase() === "manual") {
                const payload = await boost(
                    +zappiSerialNumber,
                    ZappiBoostMode.Manual,
                    +boostKwh
                );
                return this.send({ payload });
            } else if (msg.payload.zappiBoostMode?.toLowerCase() === "smart") {
                if (!msg.payload.zappiBoostCompleteTime) {
                    const text =
                        "Smart boost mode requires a completion time to be set in msg.payload.zappiBoostCompleteTime";
                    this.status({ text, fill: "red" });
                    return this.error(text, msg);
                }
                const payload = await boost(
                    zappiSerialNumber,
                    ZappiBoostMode.Smart,
                    +boostKwh,
                    msg.payload.zappiBoostCompleteTime
                );
                return this.send({ payload });
            } else if (msg.payload.zappiBoostMode?.toLowerCase() === "stop") {
                const payload = await boost(+zappiSerialNumber, ZappiBoostMode.Stop);
                return this.send({ payload });
            }

            const text = `You must set msg.payload.zappiBoostMode to one of [Manual, Smart, Stop].`;
            this.status({ text, fill: "red" });
            return this.error(text);
        });
    }
    RED.nodes.registerType("setZappiBoostMode", setZappiBoostMode);
};
