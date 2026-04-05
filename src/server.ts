import { buildApp } from "./app";
import { env } from "./config/env";
import { connectMongo } from "./config/mongo";
import { prisma } from "./config/prisma";
import { seedRoles } from "./utils/seedRoles";

const start = async () => {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected successfully");

    await seedRoles();
    await connectMongo();

    const app = await buildApp();

    await app.listen({
      port: env.PORT,
      host: "0.0.0.0",
    });

    const deployedUrl = process.env.RENDER_EXTERNAL_URL;
    const appUrl =
      deployedUrl || `http://localhost:${env.PORT}`;

    console.log(`Server running on port ${env.PORT}`);
    console.log(`App URL: ${appUrl}`);
  } catch (error) {
    console.error("Server failed to start", error);
    process.exit(1);
  }
};

start();
