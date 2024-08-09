import { model, Schema } from "mongoose";

const postSchema = new Schema({
    title: {
        type: String,
        required: false,
    },
    content: {
        type: String,
        required: true,
    },
    user_id: {
        type: Number,
        rqeuired: false,
    },
});

export const PostModel = model("Post", postSchema);
