import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

const uri = "mongodb+srv://julscatalan:ykIKNrqwsTTgPVxq@nanostorecluster.uwzao.mongodb.net/?retryWrites=true&w=majority&appName=NanoStoreCluster";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db = client.db("NanoStoreCluster"); 

export const initializeDBConnection = async () => {
    try {
        await client.connect();
        database = client.db("NanoStoreCluster"); 
        console.log("Conexión a la base de datos establecida.");
    } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
    }
};

export default db;
