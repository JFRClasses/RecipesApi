// src/config/logger.ts
import winston from "winston";
import * as appInsights from "applicationinsights";
import { envs } from "./env";

appInsights.setup(envs.appInsightsConnectionString)
  .setAutoCollectConsole(false)  
  .setAutoCollectDependencies(false)
  .setAutoCollectExceptions(false)
  .setAutoCollectRequests(false)
  .setSendLiveMetrics(false)
  .start();

const aiClient = appInsights.defaultClient;

const appInsightsTransport = new winston.transports.Console({
  level: "info",
  format: winston.format.printf(({ level, message, timestamp }) => {
    aiClient.trackTrace({
      message: `[${level}] ${message}`,
      properties: { timestamp },
    });
    return `${timestamp} [${level}] ${message}`;
  }),
});

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    appInsightsTransport, 
  ],
});
export function patchConsoleToWinston() {
  console.log = (...args) => logger.info(args.join(" "));
  console.error = (...args) => logger.error(args.join(" "));
  console.warn = (...args) => logger.warn(args.join(" "));
}
