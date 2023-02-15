import { NextFunction, Request, Response } from "express";
import { IProduct } from "../interfaces/database";
import { Product } from "../model/product";
// const { success, failure } = require("../utils/commonResponse");
import { success, failure } from "../utils/commonResponse";
import { HTTP_STATUS } from "../utils/httpStatus";
import { validationResult } from "express-validator";
import getPagination from "../utils/pagination";

class productController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page: string | number = req.query.page as string ? req.query.page as string : 0;
      const itemsPerPage: string | number = req.query.limit as string ? req.query.limit as string : 0;
      const { skip, limit } = getPagination(page as number, itemsPerPage as number);

      let products: IProduct[];
      let total: number;

      // If no page or limit is provided, return all data
      if (page === null || limit === null) {
        products = await Product.find().exec();
      }
      else {
        products = await Product.find().skip(skip).limit(limit).exec();
      }
      total = await Product.count().exec();
      if (products.length > 0) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success({ message: "All products received", data: { products, total } }));
      } else {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure({ message: "No products found" }));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const product: IProduct | null = await Product.findById(req.params.productId).exec();
      if (product) {
        return res.status(HTTP_STATUS.OK).send(success({ message: "All products received", data: product }));
      } else {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(success({ message: "No product found with this id", data: product }));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async searchProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const category: string = req.params.category;
      const searchParams: string = req.params.searchParams;
      const searchQuery = {
        [category]: { $regex: searchParams },
      };
      const product: IProduct[] | null = await Product.find(searchQuery).limit(100).exec();
      if (!product.length) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure({ message: "No result" }));
      }
      return res.status(HTTP_STATUS.OK).send(success({ message: "Found results", data: product }));
    } catch (error) {
      console.log(error);
      next();
    }
  }
}

const ProductController = new productController();
export default ProductController;
