import ProductRepository from "../repository/productRepository.js";

//Clase ProductManager
export default class ProductManager {
    #productRepository

    constructor(path) {
        this.productRepository = new ProductRepository(path, 'products.json');
    }

    getProducts = async () => {
        return await this.productRepository.getProducts();
    }

    validateProduct = async (product) => {
        let errors = [];
        
        const products = await this.getProducts();

        if(products.some(x => x.code === product.code && x.id !== product.id))
        {
            errors.push(`Ya existe un producto con código ${product.code}`);
        }

        if(product.title.trim() === "") {
            errors.push("Debe asignar un title al producto");
        }

        if(product.description.trim() === "") {
            errors.push("Debe asignar una descripción al producto");
        }

        if(product.price <= 0) {
            errors.push("El producto debe tener un valor mayor a 0");
        }

        if(product.thumbnail.trim() === "") {
            errors.push("El producto debe tener una imagen");
        }

        if(product.code.trim() === "") {
            errors.push("El producto debe tener un código");
        }

        if(product.stock < 0) {
            errors.push("El stock del producto debe ser 0 o mayor que 0");
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }
    }

    addProduct = async (product) => {
        await this.validateProduct(product);
        await this.productRepository.addProduct(product);
    }

    getProductById = async (id) => {
        return await this.productRepository.getProductById(id);
    }

    updateProduct = async (product) => {
        const dbProduct = await this.productRepository.getProductById(product.id);

        if(dbProduct == null) {
            throw new Error("El producto no existe en la base de datos");
        }

        await this.validateProduct(product);
        await this.productRepository.updateProduct(product);
    }

    deleteProduct = async (product) => {
        const dbProduct = await this.productRepository.getProductById(product.id);

        if(dbProduct == null) {
            throw new Error("El producto no existe en la base de datos");
        }

        await this.productRepository.deleteProduct(product.id);
    }
}