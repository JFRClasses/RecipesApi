import { AzureMonitorOpenTelemetryOptions } from "@azure/monitor-opentelemetry";
import { envs } from "./env";
import * as appInsights from "applicationinsights";
export const options: AzureMonitorOpenTelemetryOptions = {
  azureMonitorExporterOptions: {
    connectionString: envs.appInsightsConnectionString,
  },
  instrumentationOptions: {
    http: { enabled: true },
    postgreSql: { enabled: true },
  },
};
export function initializeAppInsightsTelemetry() {
  console.log("[Telemetry] Initializing Application Insights...");
  appInsights
    .setup(envs.appInsightsConnectionString)
    .setAutoCollectConsole(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectRequests(true)
    .setSendLiveMetrics(true)
    .start();

  console.log("[Telemetry] Application Insights initialized.");
}
