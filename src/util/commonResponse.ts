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

    validate(req: Request) {
        const validation = validationResult(req).array();
        // if (validation.length > 0) {
        return validation;
        // .map((element) => ({
        //     param: element.type,
        //     message: element.msg,
        // }));
        // }
        // return null;
    }
}

const CustomResponse = new _Response_();
export default CustomResponse;
