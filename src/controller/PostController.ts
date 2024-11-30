import { Request, Response } from "express";
import CustomResponse from "../util/commonResponse";
import { HTTP_STATUS } from "@util/httpStatus";
import PostService from "@service/PostService";
import path from "path";
import fs from "fs";
import { uploadImage } from "@middleware/files";
class postController {
    async getAll(req: Request, res: Response) {
        try {
            console.log("Request for getting all posts received");
            const { page, limit } = req.query;

            if (Number(page) < 0 || Number(limit) < 0) {
                CustomResponse.send(res, HTTP_STATUS.BAD_REQUEST, "Invalid parameters provided");
                return;
            }

            const result = await PostService.getAll(Number(page), Number(limit));

            CustomResponse.send(res, HTTP_STATUS.OK, "Successfully got all posts", result);
            return;
        } catch (error) {
            console.log(error);
            CustomResponse.send(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "An unexpected error occured");
            return;
        }
    }

    async getById(req: Request, res: Response) {
        try {
            console.log("Request for getting one post received");
            const validation = CustomResponse.validate(req);
            if (validation.length > 0) {
                CustomResponse.send(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, "An unexpected error occured", validation);
                return;
            }
            const { id } = req.params;
            const post = await PostService.getById(id);

            if (!post) {
                CustomResponse.send(res, HTTP_STATUS.NOT_FOUND, "Unable to find post");
                return;
            }
            CustomResponse.send(res, HTTP_STATUS.ACCEPTED, "Successfully found post", post);
            return;
        } catch (error) {
            console.log(error);
            CustomResponse.send(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "An unexpected error occured");
            return;
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            console.log("Request for creating one post received");
            const validation = CustomResponse.validate(req);
            if (validation.length > 0) {
                CustomResponse.send(
                    res,
                    HTTP_STATUS.UNPROCESSABLE_ENTITY,
                    "The request could not be validated",
                    validation
                );
                return;
            }

            const { title, content, user_id } = req.body;

            const result = await PostService.add(title, content, user_id);

            if (!result) {
                CustomResponse.send(res, HTTP_STATUS.OK, "Failed to create post", result);
                return;
            }

            CustomResponse.send(res, HTTP_STATUS.OK, "Successfully created post", result);
            return;
        } catch (error) {
            console.log(error);
            CustomResponse.send(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "An unexpected error occured");
            return;
        }
    }

    async uploadFile(req: Request, res: Response) {
        try {
            uploadImage(req, res, async (error) => {
                if (error && error.message) {
                    CustomResponse.send(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, error.message);
                    return;
                }

                if (!req || !req.file) {
                    CustomResponse.send(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, "File is not found");
                    return;
                }
                if (!fs.existsSync(path.join(__dirname, "../../storage/profile-picture/"))) {
                    fs.mkdirSync(path.join(__dirname, "../../storage/profile-picture/"));
                }

                fs.rename(
                    path.join(__dirname, "../../storage/", req.file.filename),
                    path.join(__dirname, "../../storage/profile-picture/", req.file.filename),
                    (fileError) => {
                        if (fileError) {
                            CustomResponse.send(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, fileError.message);
                            return;
                        }
                        CustomResponse.send(res, HTTP_STATUS.OK, "Successfully uploaded file");
                        return;
                    }
                );
            });
        } catch (error) {
            console.log(error);
            CustomResponse.send(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "An unexpected error occured");
            return;
        }
    }
}
const PostController = new postController();
export default PostController;
