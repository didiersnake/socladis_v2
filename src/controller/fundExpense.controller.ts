import { Request, Response } from "express";
import {
CreateFundExpenseInput,
} from "../schema/fundExpense.schema";
import {
  allFundExpensesPaginated,
  createFundExpense,
  deleteFundExpenseById,
  getAllFundExpense,
  getFundExpenseById,
  getFundExpenseByRange,
  updateFundExpenseById
} from "../service/fundExpense.service";

export async function createFundExpenseHandler(
  req: Request<{}, {}, CreateFundExpenseInput>,
  res: Response
) {
  const body = req.body;

  try {
    const stock = await createFundExpense(body);

    return res.status(201).json([{message:"FundExpenses Added Successfully",stockInfo:stock}]);
  } catch (e: any) {
 
    return res.status(500).send("FundExpense exists");
  }
}


//get all fund expense
export async function getAllFundExpensesController(req:Request,res:Response){

  try {
    const FundExpense = await getAllFundExpense();

     res.status(200).json(FundExpense);
    
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

export async function getAllFundExpenseByRange(req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.body;

    const sales = await getFundExpenseByRange(startDate, endDate);
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json([{ message: "Internal Server Error" }]);
  }
}


export async function getAllFundExpensesPaginated(req: Request, res: Response) {
  try {
    const {
      pageIndex = 0,
      pageSize = 10,
      sort,
      query,
      filterData,
      startDate,
      endDate,
    } = req.body;

    const sales = await allFundExpensesPaginated({
      pageIndex,
      pageSize,
      sort,
      query,
      filterData,
      startDate,
      endDate,
    });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json([{ message: "Internal Server Error" }]);
  }
}


//get fund expense
export async function getFundExpensesByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const FundExpense = await getFundExpenseById(id); // Call the getfund expenseById function from your service file

    if (!FundExpense) {
      res.status(404).json([{ message: 'FundExpenses not found' }]);
    } else {
    const { ...responseWithoutCode } = FundExpense.toObject();

     res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//update fund expense
export async function updateFundExpensesByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const body = req.body;
    const updatedFundExpense = await updateFundExpenseById(id,body);

    if (!updatedFundExpense) {
      res.status(404).json([{ message: 'FundExpenses not found' }]);

    } else {
            // Exclude the verificationCode and passwordResetCode field from the response
            const { ...responseWithoutCode } = updatedFundExpense.toObject();

            res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//delete fund expense
export async function deleteFundExpensesByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const deleteFundExpense = await deleteFundExpenseById(id);

    if (!deleteFundExpense) {
      res.status(404).json([{ message: 'FundExpense not found' }]);

    } else {

        res.status(200).json([{ message: 'FundExpense Deleted Successfully' }]);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}