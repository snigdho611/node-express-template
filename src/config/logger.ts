import winston, { format, createLogger, transports } from "winston";
const { combine, timestamp, prettyPrint, errors, label } = format;

const logger = createLogger({
    format: combine(
        label({ label: "Service" }),
        timestamp(),
        winston.format.colorize(),
        prettyPrint()
    ),
    defaultMeta: { service: "default" },
    transports: [
        new transports.Console({
            level: "error",
            format: combine(errors({ stack: true }), timestamp(), prettyPrint()),
        }),
        new transports.Console({ level: "info", format: format.simple() }),
    ],
});

export default logger;
