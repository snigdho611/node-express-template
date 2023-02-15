import express, { Request, Response } from "express";
import { failure, success } from "../utils/commonResponse";
import { Sale } from "../model/sale";
import { Result, ValidationError, validationResult } from "express-validator";

class saleController {

    async getSalesByCustomer(req: Request, res: Response) {
        try {
            const { customerId } = req.params;
            if (customerId.length !== 24) {
                return res.send(failure({ message: "Customer ID is not in the correct format!" }));
            }
            const results = await Sale
                .find({ customerId: customerId })
                .populate({
                    path: "cart.productId",
                    select: {
                        name: 1,
                        weight: 1,
                        type: 1,
                        image: 1,
                        price: 1,
                    }
                })
                .select({ cart: 1, _id: 0 });
            if (results.length > 0) {
                return res.send(success({ message: "Successfully got all sales", data: results }));
            } else {
                return res.send(failure({ message: "Customer does not exist!" }));
            }
        } catch (error) {
            console.log(error);
            return res.send(failure({ message: "Something went wrong" }));
        }
    }

    async addSale(req: Request, res: Response) {
        try {
            const validatorResult: Result<ValidationError> = validationResult(req);
            if (!validatorResult.isEmpty()) {
                return res.send(failure({ message: "Invalid inputs!", error: validatorResult.array() }));
            }
            const { cart } = req.body;
            const newSale = new Sale();
            newSale.customerId = req.body.customerId;
            newSale.cart = req.body.cart;
            newSale.total = cart.reduce((accumulator: any, current: any) => accumulator + current, 0);
            newSale.verified = false;
            console.log(cart.reduce((accumulator: any, current: any) => accumulator + current.quantity, 0));
            return res.send(success({ message: "Successfully got all sales", data: newSale }));
        } catch (error) {
            console.log(error);
            return res.send(failure({ message: "Something went wrong" }));
        }
    }
}

const SaleController = new saleController();
export default SaleController;