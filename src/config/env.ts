import 'dotenv/config';

export const envs = {
   port: process.env.PORT || 3000,
   dbName: process.env.DB_NAME || "recipes_db",
   dbUser: process.env.DB_USER || "user",
   dbPassword: process.env.DB_PASSWORD || "password",
   dbHost: process.env.DB_HOST || "localhost",
   dbPort: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
   openAIApiKey: process.env.OPENAI_API_KEY || "",
   upslapshApiKey: process.env.UNSPLASH_API_KEY || "",
   appInsightsConnectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || ""
}