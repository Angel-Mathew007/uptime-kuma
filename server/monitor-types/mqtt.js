// server/monitor-types/mqtt.js
const { MonitorType } = require("./monitor-type");
const { log, UP } = require("../../src/util");
const mqtt = require("mqtt"); // only declare once
const jsonata = require("jsonata");
const fs = require("fs"); // for TLS files if needed

class MqttMonitorType extends MonitorType {
    name = "mqtt";

    /**
     * @inheritdoc
     */
    async check(monitor, heartbeat, server) {
        const receivedMessage = await this.mqttAsync(monitor.hostname, monitor.mqttTopic, {
            port: monitor.port,
            username: monitor.mqttUsername,
            password: monitor.mqttPassword,
            interval: monitor.interval,
            websocketPath: monitor.mqttWebsocketPath,
        });

        if (!monitor.mqttCheckType || monitor.mqttCheckType === "") {
            monitor.mqttCheckType = "keyword"; // default
        }

        if (monitor.mqttCheckType === "keyword") {
            if (receivedMessage != null && receivedMessage.includes(monitor.mqttSuccessMessage)) {
                heartbeat.msg = `Topic: ${monitor.mqttTopic}; Message: ${receivedMessage}`;
                heartbeat.status = UP;
            } else {
                throw new Error(`Message Mismatch - Topic: ${monitor.mqttTopic}; Message: ${receivedMessage}`);
            }
        } else if (monitor.mqttCheckType === "json-query") {
            const parsedMessage = JSON.parse(receivedMessage);
            const expression = jsonata(monitor.jsonPath);
            const result = await expression.evaluate(parsedMessage);

            if (result?.toString() === monitor.expectedValue) {
                heartbeat.msg = "Message received, expected value is found";
                heartbeat.status = UP;
            } else {
                throw new Error("Message received but value is not equal to expected value, value was: [" + result + "]");
            }
        } else {
            throw new Error("Unknown MQTT Check Type");
        }
    }

    /**
     * Connect to MQTT Broker, subscribe to topic and receive message as String
     */
    mqttAsync(hostname, topic, options = {}) {
        return new Promise((resolve, reject) => {
            const { port, username, password, websocketPath, interval = 20 } = options;

            if (!/^(?:http|mqtt|ws)s?:\/\//.test(hostname)) {
                hostname = "mqtt://" + hostname;
            }

            const timeoutID = setTimeout(() => {
                log.debug("mqtt", "MQTT timeout triggered");
                client.end();
                reject(new Error("Timeout, Message not received"));
            }, interval * 1000 * 0.8);

            let mqttUrl = `${hostname}:${port}`;
            if (hostname.startsWith("ws://") || hostname.startsWith("wss://")) {
                mqttUrl = `${hostname}:${port}${websocketPath ? (websocketPath.startsWith("/") ? websocketPath : "/" + websocketPath) : ""}`;
            }

            log.debug("mqtt", `MQTT connecting to ${mqttUrl}`);

            const client = mqtt.connect(mqttUrl, {
                username,
                password,
                clientId: "uptime-kuma_" + Math.random().toString(16).substr(2, 8)
            });

            client.on("connect", () => {
                log.debug("mqtt", "MQTT connected");
                try {
                    client.subscribe(topic, () => {
                        log.debug("mqtt", "MQTT subscribed to topic");
                    });
                } catch (e) {
                    client.end();
                    clearTimeout(timeoutID);
                    reject(new Error("Cannot subscribe topic"));
                }
            });

            client.on("error", (error) => {
                client.end();
                clearTimeout(timeoutID);
                reject(error);
            });

            client.on("message", (messageTopic, message) => {
                if (messageTopic === topic) {
                    client.end();
                    clearTimeout(timeoutID);
                    resolve(message.toString("utf8"));
                }
            });
        });
    }
}

/**
 * Optional helper function to create MQTT client with TLS support
 */
function createMQTTClient(config) {
    const options = {
        username: config.username,
        password: config.password,
        reconnectPeriod: config.reconnectPeriod || 5000,
    };

    if (config.tlsEnabled) {
        options.protocol = "mqtts"; // secure MQTT
        options.rejectUnauthorized = config.rejectUnauthorized ?? true;

        if (config.caFile) options.ca = [fs.readFileSync(config.caFile)];
        if (config.certFile && config.keyFile) {
            options.cert = fs.readFileSync(config.certFile);
            options.key = fs.readFileSync(config.keyFile);
        }
        if (config.alpnProtocols) options.ALPNProtocols = config.alpnProtocols;
    }

    const client = mqtt.connect(config.url, options);

    client.on("connect", () => console.log("Connected to MQTT broker"));

    client.on("message", (topic, message) => {
        // Reset timeout logic if needed
    });

    return client;
}

module.exports = {
    MqttMonitorType,
    createMQTTClient,
};
