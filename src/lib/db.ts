import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const getDatabaseUrl = () => {
  const dbName = 'dev.db';
  const srcPath = path.join(process.cwd(), 'prisma', dbName);
  
  if (process.env.NODE_ENV === 'production') {
    const destPath = path.join('/tmp', dbName);
    
    try {
      if (!fs.existsSync(destPath)) {
        console.log(`Copying database from ${srcPath} to ${destPath}`);
        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, destPath);
          console.log('Database copied successfully to /tmp.');
        } else {
          console.error(`Source database not found at ${srcPath}`);
        }
      } else {
        console.log('Database already exists in /tmp');
      }
      return `file:${destPath}`;
    } catch (error) {
      console.error('Failed to copy database to /tmp:', error);
    }
  }
  
  return `file:${srcPath}`;
};

const databaseUrl = getDatabaseUrl();
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

