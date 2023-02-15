import { Request, Response, NextFunction } from "express";
import { ILogin, IUser } from "../interfaces/database";
import { Result, ValidationError, validationResult } from "express-validator";
import { Login } from "../model/login";
import { User } from "../model/user";
import { success, failure } from "../utils/commonResponse";
import crypto = require("crypto");
import path from "path";
import { HTTP_STATUS } from "../utils/httpStatus";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ejs from "ejs";
import sendMail from "../config/mail";
import { promises as fsPromises } from 'fs';
const ejsRenderFile = ejs.renderFile;

class authenticateController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatorResult: Result<ValidationError> = validationResult(req);
      if (!validatorResult.isEmpty()) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure({ message: "Invalid Inputs", error: validatorResult.array() }));
      }
      const { email, password } = req.body;

      const login: ILogin | null = await Login.findOne({ email: email }).populate("userId").exec();
      if (!login) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure({ message: "User login is not authorized" }));
      }
      const passMatch = await bcrypt.compare(password, login.password);

      if (!passMatch) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure({ message: "User login is not authorized" }));
      }

      const userData = {
        _id: login._id,
        email: login.email,
        isAdmin: login.isAdmin,
        isEmailVerified: login.isEmailVerified,
        firstName: (login.userId as IUser).firstName,
        userId: (login.userId as IUser)._id,
        lastName: (login.userId as IUser).lastName,
      };
      console.log(login);
      if (!process.env.JWT_SECRET_KEY) {
        return;
      }
      const jwtToken: string = jwt.sign(userData, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
      const resData = {
        access_token: jwtToken,
        ...userData,
      };

      return res.status(HTTP_STATUS.OK).send(success({ message: "Signed in successfully!", data: resData }));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const validatorResult: Result<ValidationError> = validationResult(req);
      if (!validatorResult.isEmpty()) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure({ message: "Invalid inputs", error: validatorResult.array() }));
      }
      const { firstName, lastName, phone } = req.body;
      const user: IUser = new User({ firstName: firstName, lastName: lastName, type: "regular", phone: phone, address: null, balance: 0 });
      await user.save();

      const email: string = req.body.email;
      const password: string = await bcrypt.hash(req.body.password, 10);
      const login: ILogin = new Login({ email: email, password: password, userId: user._id });

      if (!process.env.JWT_SECRET_KEY) {
        return;
      }

      const jwtToken: string = jwt.sign(
        {
          _id: login._id,
          firstName: firstName,
          lastName: lastName,
          email: login.email,
          isAdmin: login.isAdmin,
          isEmailVerified: login.isEmailVerified,
          userId: login.userId,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      const resData = {
        token: jwtToken,
        userId: login.userId,
        isAdmin: login.isAdmin,
        isEmailVerified: login.isEmailVerified,
        firstName: (login.userId as IUser).firstName,
        lastName: (login.userId as IUser).lastName,
        _id: login._id,
      };

      const verifyToken: string = crypto.randomBytes(32).toString("hex");
      login.emailToken = verifyToken;
      login.emailTokenExpire = new Date(Date.now() + 60 * 60 * 1000);
      await login.save();
      console.log(process.env.FRONTEND_BASE_URI, "email-verify", verifyToken, login._id.toString());
      if (!process.env.BACKEND_BASE_URI) {
        return;
      }
      const emailVerifyUrl: string = path.join(
        process.env.BACKEND_BASE_URI,
        "auth",
        "email-verify",
        verifyToken,
        login._id.toString()
      );

      const htmlStr = await ejsRenderFile(path.join(__dirname, "..", "mails", "VerifyMail.ejs"), {
        name: user.firstName + " " + user.lastName,
        emailUrl: emailVerifyUrl,
      });

      sendMail({
        from: "ABC Store <mail@abcstore.com>",
        to: login.email,
        subject: "Verify your email",
        html: htmlStr,
      });

      return res
        .status(HTTP_STATUS.OK)
        .send(success({ message: "Successully signed up, please check your email.", data: resData }));
    } catch (error) {
      console.log(error);
    }
  }

  async emailVerify(req: Request, res: Response, next: NextFunction) {
    try {
      const validatorResult: Result<ValidationError> = validationResult(req);
      if (!validatorResult.isEmpty()) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure({ message: "Invalid inputs", error: validatorResult.array() }));
      }
      const login: ILogin | null = await Login.findOne({
        emailToken: req.params.token,
        _id: req.params.userId,
      });
      if (!login) {
        // User not found
        return res.redirect(process.env.FRONTEND_BASE_URI + "/email-verify?status=1");
      }
      if (login.isEmailVerified === true) {
        // Mail already validated
        return res.redirect(process.env.FRONTEND_BASE_URI + "/email-verify?status=2");
      }
      if (login.emailTokenExpire && login.emailTokenExpire < new Date(Date.now())) {
        // Mail token expired
        return res.redirect(process.env.FRONTEND_BASE_URI + "/email-verify?status=3");
      }
      login.emailToken = null;
      login.emailTokenExpire = null;
      login.isEmailVerified = true;
      login.save();
      res.status(HTTP_STATUS.OK);
      return res.redirect(process.env.FRONTEND_BASE_URI + "/email-verify?status=4");
    } catch (error) {
      console.log(error);
      return res.redirect(process.env.FRONTEND_BASE_URI + "/email-verify?status=5");
    }
  }

  async requestResetPasswordEmail(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(process.env.NODEMAILER_USER, process.env.NODEMAILER_PASS);

      const validatorResult: Result<ValidationError> = validationResult(req);
      if (!validatorResult.isEmpty()) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure({ message: "Invalid inputs", error: validatorResult.array() }));
      }
      const login: ILogin | null = await Login.findOne({ email: req.body.email })
        .populate("userId")
        .select("email passwordResetToken passwordResetExpire userId");
      if (!login) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure({ message: "No email found for a user" }));
      }
      const token = crypto.randomBytes(32).toString("hex");
      login.passwordResetToken = token;
      login.passwordResetExpire = new Date(Date.now() + 60 * 60 * 1000);
      await login.save();
      // console.log(login);

      if (!process.env.FRONTEND_BASE_URI) {
        return;
      }

      const resetPasswordURL = path.join(
        process.env.FRONTEND_BASE_URI,
        "reset-password",
        token,
        login._id.toString()
      );
      const htmlStr = await ejsRenderFile(
        path.join(__dirname, "..", "mails", "ResetPassword.ejs"),
        {
          name: (login.userId as IUser).firstName + " " + (login.userId as IUser).lastName,
          resetUrl: resetPasswordURL,
        }
      );

      sendMail({
        from: "ABC Store <abc@store.com>",
        to: req.body.email,
        subject: "Password Reset Request",
        html: htmlStr,
      });
      return res
        .status(HTTP_STATUS.OK)
        .send(success({ message: "Successully requested for password, please check your email." }));
    } catch (error) {
      console.log(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const validatorResult: Result<ValidationError> = validationResult(req);
      if (!validatorResult.isEmpty()) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure({ message: "Invalid inputs", error: validatorResult.array() }));
      }
      // console.log(req.body);
      const newPassword = req.body.password;
      const login: ILogin | null = await Login.findById({ _id: req.body.userId }).populate("userId");
      if (!login) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure({ message: "User not found." }));
      }
      const passMatch = await bcrypt.compare(newPassword, login.password);
      if (login.passwordResetToken === null) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure({ message: "Link is not available anymore." }));
      }
      if (login.passwordResetExpire && login.passwordResetExpire < new Date(Date.now())) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure({ message: "Link expired" }));
      }
      if (passMatch) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure({ message: "New password cannot be same as old password" }));
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      login.password = hashedPassword;
      login.passwordResetToken = null;
      login.passwordResetExpire = null;
      await login.save();
      return res
        .status(HTTP_STATUS.OK)
        .send(success({ message: "Successully updated password, please log in" }));
    } catch (error) {
      console.log(error);
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const validatorResult: Result<ValidationError> = validationResult(req);
      if (!validatorResult.isEmpty()) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure({ message: "Invalid inputs", error: validatorResult.array() }));
      }
      const { userId, currentPassword, newPassword, confirmPassword } = req.body;
      console.log(userId, currentPassword, newPassword, confirmPassword);

      if (newPassword !== confirmPassword) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure({ message: "Passwords do not match." }));
      }

      if (currentPassword === newPassword) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure({ message: "New password cannot be same as old password." }));
      }
      const result: ILogin | null = await Login.findOne({ userId: userId });
      if (!result) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure({ message: "User was not found." }));
      }

      const passMatch = await bcrypt.compare(currentPassword, result.password);

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      result.password = hashedPassword;
      await result.save();
      if (passMatch) {
        return res.send(success({ message: "Successfully updated password" }));
      } else {
        console.log(result);
      }
    } catch (error) {
      return res
        .status(HTTP_STATUS.NOT_ACCEPTABLE)
        .send(failure({ message: "Something went wrong" }));
    }
  }
}

const AuthenticateController = new authenticateController();
export default AuthenticateController;