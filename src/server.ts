import { app } from "./app";
import { AppDataSource } from "./database/db";
import 'dotenv/config'

const PORT = process.env.PORT || 4001


const startServer = () => {
    AppDataSource.initialize()
        .then(() => {
            console.log('database connected!')
            app.listen(PORT, () => console.log(`server connected on port: ${PORT}`))
        })
        .catch(error => {
            console.log(error);

        })
}

startServer()