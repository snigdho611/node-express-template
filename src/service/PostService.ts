import { PostModel } from "src/model/Post";

class postService {
    async getAll(page?: number, limit?: number) {
        // const result = await prisma.post.findMany({
        //     skip: page ? (page - 1) * (limit ? limit : 8) : 0,
        //     take: limit ? limit : 8,
        // });
        const result = await PostModel.find({})
            .skip(page ? (page - 1) * (limit ? limit : 8) : 0)
            .limit(limit ? limit : 8);

        return result;
    }

    async getById(id: string) {
        const post = await PostModel.findById(id);

        return post;
    }

    async add(title: string, content: string, user_id: number) {
        const result = await PostModel.create({
            title,
            content,
            user_id,
        });

        return result;
    }
}

const PostService = new postService();
export default PostService;
