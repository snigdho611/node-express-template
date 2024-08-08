import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import posts from "../server/data/posts.json";

async function main() {
    await prisma.post.createMany({
        data: posts,
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
