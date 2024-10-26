import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile("index.html", { root : "public" });
});

app.get('/404', (req, res) => {
    res.sendFile("404.html", { root : "public" });
});

app.use((req, res) => {
    res.redirect('/404');
});

app.listen(3000, () => {
  console.log(`Running on port 3000`);
});
