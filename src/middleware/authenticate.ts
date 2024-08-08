import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../util/httpStatus";
import CustomResponse from "@util/commonResponse";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.token) {
        next();
    } else {
        return CustomResponse.send(res, HTTP_STATUS.FORBIDDEN, "Access is restricted");
    }
};
