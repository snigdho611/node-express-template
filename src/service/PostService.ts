import prisma from "@config/database";

class postService {
    async getAll(page?: number, limit?: number) {
        const result = await prisma.post.findMany({
            skip: page ? (page - 1) * (limit ? limit : 8) : 0,
            take: limit ? limit : 8,
        });

        return result;
    }

    async getById(id: string) {
        const post = await prisma.post.findFirst({
            where: {
                id: id,
            },
        });

        return post;
    }

    async add(title: string, content: string, user_id: number) {
        const result = await prisma.post.create({
            data: {
                title,
                content,
                user_id,
            },
        });

        return result;
    }
}

const PostService = new postService();
export default PostService;
