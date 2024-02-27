import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'DD-MM-YYYY HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'technology-radar' },
  transports: [
    new transports.Console(),
    new transports.File({ filename: '/tmp/technology-radar.log' })
  ]
});
