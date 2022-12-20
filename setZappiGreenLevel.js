module.exports = function (RED) {
    function SetZappiGreenLevel(config) {
        RED.nodes.createNode(this, config);
        this.server = RED.nodes.getNode(config.server);
        const myenergi = this.server.myenergi;

        this.on("input", async (msg) => {
            if (myenergi == null) {
                const text = "API Error, check credentials";
                this.status({ text, fill: "red" });
                return this.error(text);
            }

            if (msg.payload.greenLevel === null || msg.payload.greenLevel === undefined) {
                const text = `You must set msg.payload.greenLevel`;
                this.status({ text, fill: "red" });
                return this.error(text);
            }

            let serial = msg.payload.serial;
            if (!serial) {
                const zappiAll = await myenergi.getStatusZappiAll();
                serial = zappiAll[0].sno;
            }

            // This API call is slightly different to others in that it echoes back
            // the mgl if successful rather than a status of 0. If it fails, you then
            // get status and status text.
            const payload = await myenergi.setZappiGreenLevel(+serial, +msg.payload.greenLevel);
            if (payload?.mgl !== +msg.payload.greenLevel) {
                this.status({
                    text: `Set green level failed - status [${payload?.status}] text [${payload?.statustext}]`,
                    fill: "red",
                });
            } else {
                this.status({
                    text: `Green level set to [${payload.mgl}]`,
                    fill: "green",
                });
            }

            return this.send({ payload });
        });
    }

    RED.nodes.registerType("setZappiGreenLevel", SetZappiGreenLevel);
};
