import { HTTP_STATUS } from "../util/httpStatus";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

class _Response_ {
    send(res: Response, status: number, message: string, result: unknown = null) {
        const response: { success: boolean; message: string; error?: unknown; data?: unknown } = {
            success: false,
            message: "",
        };

        if (status >= 400) {
            response.success = false;
            response.message = "Internal server error";
            response.error = result;
        } else {
            response.success = true;
            response.message = "Successfully completed operations";
            response.data = result;
        }
        if (message) {
            response.message = message;
        }
        return res.status(status).send(response);
    }

    validate(req: Request, res: Response, messageOnError: string) {
        const validation = validationResult(req).array();
        if (validation.length > 0) {
            this.send(
                res,
                HTTP_STATUS.UNPROCESSABLE_ENTITY,
                messageOnError ? messageOnError : "Validation failed",
                validation.map((element) => ({
                    param: element.type,
                    message: element.msg,
                }))
            );
            return true;
        }
        return false;
    }
}

const CustomResponse = new _Response_();
export default CustomResponse;
