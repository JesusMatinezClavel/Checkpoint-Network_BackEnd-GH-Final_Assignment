import Express, { Request, Response } from "express";

const app = Express()

app.listen(3000, () => console.log('server connected on 3000'))

app.get('/', (req: Request, res: Response) => {
    res.send('hello puta madre')
})