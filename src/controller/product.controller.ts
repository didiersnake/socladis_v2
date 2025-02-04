import { Request, Response } from "express";
import {
CreateProductInput,
} from "../schema/product.schema";
import {
  allProductsPaginated,
  createProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
} from "../service/product.service";

export async function createProductHandler(
  req: Request<{}, {}, CreateProductInput>,
  res: Response
) {
  const body = req.body;

  try {
    const stock = await createProduct(body);

    return res.status(201).json([{message:"Product Added Successfully",stockInfo:stock}]);
  } catch (e: any) {
 
    return res.status(500).send("product exists");
  }
}


//get all user
export async function getAllProductController(req:Request,res:Response){

  try {
    const stock = await getAllProducts(); 

     res.status(200).json(stock);
    
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

export async function getPaginatedProducts(req:Request, res:Response) {
  try {
    const { pageIndex = 0, pageSize = 10, sort, query, filterData } = req.body;

    const stock = await allProductsPaginated({
      pageIndex,
      pageSize,
      sort,
      query,
      filterData,
    });

    res.status(200).json(stock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

//get user
export async function getProductByIdController(req:Request,res:Response){

  try {
    const { id } = req.params;
     // Extract the ID from the request parameters
    const stock = await getProductById(id); // Call the getUserById function from your service file

    if (!stock) {
      res.status(404).json([{ message: 'Product not found' }]);
    } else {
    const { ...responseWithoutCode } = stock.toObject();

     res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//update user
export async function updateProductByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const body = req.body;
    const updatedStock = await updateProductById(id,body);

    if (!updatedStock) {
      res.status(404).json([{ message: 'Product not found' }]);

    } else {
            // Exclude the verificationCode and passwordResetCode field from the response
            const { ...responseWithoutCode } = updatedStock.toObject();

            res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//delete user
export async function deleteProductByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const deleteStock = await deleteProductById(id);

    if (!deleteStock) {
      res.status(404).json([{ message: 'Product not found' }]);

    } else {

        res.status(200).json([{ message: 'Product Deleted Successfully' }]);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}