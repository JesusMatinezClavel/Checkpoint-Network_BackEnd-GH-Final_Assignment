import { app } from "./app";
import { AppDataSource } from "./database/db";

const startServer = () => {
    AppDataSource.initialize()
        .then(() => {
            console.log('database connected!')
            app.listen(3000, () => console.log('server connected on port 3000'))
        })
        .catch(error => {
            console.log(error);

        })
}

startServer()