import express from "express";
import { urlencoded, json } from "body-parser";
import boom from "express-boom";
import api from "./routes/api";
import cors from "cors";

const app = express();
const PORT = 8000;

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(boom());
app.use(cors());
app.use('/api', api);

app.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${PORT}`);
});