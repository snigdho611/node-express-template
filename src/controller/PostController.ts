import { Request, Response } from "express";
import CustomResponse from "../util/commonResponse";
import { HTTP_STATUS } from "@util/httpStatus";
import PostService from "@service/PostService";
import path from "path";
import fs from "fs";
import { uploadImage } from "@middleware/files";
import logger from "@config/logger";
class postController {
    async getAll(req: Request, res: Response) {
        try {
            logger.info("Request for getting all posts received");
            const { page, limit } = req.query;

            if (Number(page) < 0 || Number(limit) < 0) {
                logger.error("Invalid parameters provided")
                CustomResponse.send(res, HTTP_STATUS.BAD_REQUEST, "Invalid parameters provided");
                return;
            }

            const result = await PostService.getAll(Number(page), Number(limit));

            logger.info("Successfully got all posts")
            CustomResponse.send(res, HTTP_STATUS.OK, "Successfully got all posts", result);
            return;
        } catch (error) {
            logger.error(error)
            CustomResponse.send(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "An unexpected error occured");
            return;
        }
    }

    async getById(req: Request, res: Response) {
        try {
            logger.info("Request for getting one post received");
            const validation = CustomResponse.validate(req);
            if (validation.length > 0) {
                logger.error("The request could not be validated", validation)
                CustomResponse.send(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, "An unexpected error occured", validation);
                return;
            }
            const { id } = req.params;
            const post = await PostService.getById(Number(id));

            if (!post) {
                logger.error("Unable to found post")
                CustomResponse.send(res, HTTP_STATUS.NOT_FOUND, "Unable to find post");
                return;
            }
            logger.info("Successfully found post")
            CustomResponse.send(res, HTTP_STATUS.ACCEPTED, "Successfully found post", post);
            return;
        } catch (error) {
            logger.error(error)
            CustomResponse.send(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "An unexpected error occured");
            return;
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            logger.info("Request for creating one post received");
            const validation = CustomResponse.validate(req);
            if (validation.length > 0) {
                logger.error("The request could not be validated", validation)
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
                logger.error("Failed to create post")
                CustomResponse.send(res, HTTP_STATUS.OK, "Failed to create post", result);
                return;
            }

            logger.info("Successfully created post")
            CustomResponse.send(res, HTTP_STATUS.OK, "Successfully created post", result);
            return;
        } catch (error) {
            logger.error(error)
            CustomResponse.send(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "An unexpected error occured");
            return;
        }
    }

    async uploadFile(req: Request, res: Response) {
        try {
            uploadImage(req, res, async (error) => {
                if (error && error.message) {
                    logger.error(error.message)
                    CustomResponse.send(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, error.message);
                    return;
                }

                if (!req || !req.file) {
                    logger.error("File is not found")
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
                            logger.error(fileError.message)
                            CustomResponse.send(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, fileError.message);
                            return;
                        }
                        
                        logger.info("Successfully uploaded file")
                        CustomResponse.send(res, HTTP_STATUS.OK, "Successfully uploaded file");
                        return;
                    }
                );
            });
        } catch (error) {
            logger.error(error)
            CustomResponse.send(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "An unexpected error occured");
            return;
        }
    }
}
const PostController = new postController();
export default PostController;
