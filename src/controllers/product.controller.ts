import {Request, Response} from 'express';
import { IProduct} from '../models/product';
import {ProductService} from '../services/product.service';
import  { CompanyService }  from '../services/company.service';

const productService = new ProductService();
const companyService = new CompanyService();
/**
 * @swagger
 * /api/subjects:
 *   post:
 *     summary: Create a new subject
 *     tags: [Subjects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       201:
 *         description: The subject was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       400:
 *         description: Error creating subject
 */



export async function postProduct(req: Request, res: Response): Promise<void> {
    try {

        try{
            req.body as IProduct;
        } catch (error) {
            res.status(400).json({ message: "Error en el formato del producto" });
            return;
        }
        
        const product = req.body as IProduct;
        if (!product.name || !product.price || !product.description) {
            res.status(400).json({ message: "Nombre, precio y descripción son obligatorios" });
            return;
        }
        
        if (!product.companyId) {
            res.status(400).json({ message: "ID de la empresa es obligatorio" });
            return;
        }
        const newProduct = await productService.postProduct(product);
        
        // Asociar el producto a la empresa usando el servicio directamente
        const updatedCompany = await companyService.addProductToCompany(newProduct.companyId.toString(), newProduct._id.toString());
        if (!updatedCompany) {
            res.status(404).json({ message: "No se encontró la empresa" });
            return;
        }

        res.status(200).json({newProduct, message: "Producto creado correctamente"});
        return;

    } catch (error:any) {
        if (error.code === 11000) {
            res.status(403).json({ message: "El producto ya existe" });
            return;
        } else {
            res.status(500).json({ message: "Error al crear el producto", error: error.message });
            return;
        }
    }
}


/**
 * @swagger
 * /api/subjects:
 *   get:
 *     summary: Get all subjects
 *     tags: [Subjects]
 *     responses:
 *       200:
 *         description: List of all subjects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subject'
 *       400:
 *         description: Error getting subjects
 */

export async function getAllProducts(req: Request, res: Response): Promise<void> {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ message: "Error getting products", error });
    }
}

/**
 * @swagger
 * /api/subjects/{id}:
 *   get:
 *     summary: Get a subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The subject ID
 *     responses:
 *       200:
 *         description: The subject description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       400:
 *         description: Error getting subject
 */


export async function getProductById(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        if (!id || id.length !== 24) {
            res.status(400).json({ message: "ID inválido" });
        }
        const product = await productService.getProductById(id);
        if (!product) {
            res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(product);
    } catch (error: any) {
        res.status(500).json({ message: "Error getting product", error: error.message });
    }
}

/**
 * @swagger
 * /api/subjects/{id}:
 *   put:
 *     summary: Update a subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The subject ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       200:
 *         description: The updated subject
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       400:
 *         description: Error updating subject
 */

export async function updateProductById(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        const product = req.body as IProduct;
        if (!id || id.length !== 24) {
            res.status(400).json({ message: "ID inválido" });
        }

        const updatedProduct = await productService.updateProductById(id, product);
        if (!updatedProduct) {
            res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(updatedProduct);
    } catch (error: any) {
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
}

/**
 * @swagger
 * /api/subjects/{id}:
 *   delete:
 *     summary: Delete a subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The subject ID
 *     responses:
 *       200:
 *         description: The deleted subject
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       400:
 *         description: Error deleting subject
 */

export async function deleteProductById(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        if (!id || id.length !== 24) {
            res.status(400).json({ message: "ID inválido" });
        }
        const deletedProduct = await productService.deleteProductById(id);
        if (!deletedProduct) {
            res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(deletedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: (error as any).message });
    }
}