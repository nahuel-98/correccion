import File from "../helper/file.js";

//Clase de acceso a datos.
//Si la forma de persistencia cambia, cambia el objeto repositorio 
//pero no la lógica del ProductManager.
export default class ProductRepository {
    #file
    constructor(path, fileName) {
        this.file = new File(path, fileName, 'utf-8');
    }

    //Lee del archivo los productos y devuelve un array de objetos productos.
    getProducts = async () => {
        try {
            if(!this.file.exist()) return [];
            
            const data = await this.file.read();
            const products = JSON.parse(data);
            return products;
            
        } catch(error) {
            throw new Error(
                `Se generó un error en la lectura de los productos: ${error}`
            );
        }
    }

    addProduct = async (product) => {
        try {

            let maxId = 0;
            const products = await this.getProducts();

            if(products && products.length > 0) {
                maxId = products.reduce((prev, current) => {
                    return (prev.id > current.id) ? prev : current;
                }).id;
            }

            product.id = maxId + 1;

            products.push(product);

            await this.file.write(JSON.stringify(products, null, '\t'));

        } catch (error) {
            
            throw new Error(
                `Se generó un error en la escritura del producto: ${error}`
            );

        }
    }

    updateProduct = async (product) => {
        try {

            const products = await this.getProducts();
            const newProducts = products.filter(p => p.id !== product.id);

            newProducts.push(product);

            await this.file.write(JSON.stringify(newProducts, null, '\t'));

        } catch (error) {

            throw new Error(
                `Se generó un error en la actualización del producto: ${error}`
            );

        }
    }
    
    getProductById = async (id) => {
        try {

            const products = await this.getProducts();
            const product = products.find(p => p.id == id);

            return product;
            
        } catch (error) {

            throw new Error(
                `Se generó un error mientras obteniamos el producto: ${error}`
            );

        }
    }

    deleteProduct = async (id) => {
        try {

            const products = await this.getProducts();
            const newProducts = products.filter(p => p.id != id);

            await this.file.write(JSON.stringify(newProducts, null, '\t'));

        } catch (error) {

            throw new Error(
                `Se generó un error mientras eliminabamos el producto: ${error}`
            );

        }
    }
}