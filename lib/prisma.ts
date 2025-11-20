// import { PrismaClient } from '/generated/client'
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

export default prisma;

// // import { PrismaClient } from '@prisma/client';
// // import { PrismaClient } from '@prisma/client/edge'
// import { PrismaClient } from "../generated/prisma/client";
// import { withAccelerate } from '@prisma/extension-accelerate'

// // const prisma = new PrismaClient().$extends(withAccelerate())

// const prismaClientSingleton = () => {
//   // return new PrismaClient();
//   return new PrismaClient(
    
//   ).$extends(withAccelerate())
// };

// declare const globalThis: {
//   prismaGlobal: ReturnType<typeof prismaClientSingleton>;
// } & typeof global;

// const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// export default prisma;

// // Ensure the prisma instance is reused across hot reloads in development
// if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;