import express from 'express';
import { createProduct, deleteProduct, retrieveProduct, retrieveProductById, uptateProduct } from '../controllers/ProductController.js';

const productRouter = express.Router();

productRouter.post('/',createProduct);
productRouter.get('/',retrieveProduct);
productRouter.put('/:productId',retrieveProductById);
productRouter.post('/:productId',uptateProduct);
productRouter.delete('/:productId',deleteProduct);

export default productRouter;