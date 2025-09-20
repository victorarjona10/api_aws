
import { connect, connection } from 'mongoose'
import { CompanyModel } from './models/company';
import { ProductModel } from './models/product';

                //mongodb://localhost:27017/proyecto
                //mongodb://mongodb:27017/Ops
                //mongodb+srv://victorarjona:RkJ7CyZ46HzsvC3b@quickfindeaproject.mr2tj.mongodb.net/?retryWrites=true&w=majority&appName=QuickFindEAProject

const mongoURI = 'mongodb://localhost:27017/proyecto';  

export async function startConnection() {
    try {
        await connect(mongoURI, {
        });
        console.log('Connected to MongoDB successfully!');

         // Crear el índice de texto para CompanyModel  !!!SOLO SE CREA UNA VEZ AQUI O DESDE LINEA DE COMANDOS DE MONGODB!!!!
        // await CompanyModel.collection.createIndex({  name: "text" });
        // await ProductModel.collection.createIndex({ name: "text" });
    } catch (err) {
        console.error('Unable to connect to MongoDB. Error:', err);
    }
}

