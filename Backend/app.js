import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import authRoutes from './routes/authRoute.js';
import reportRoutes from './routes/reportRoute.js';
import adminRoutes from './routes/adminRoute.js';
import { fileURLToPath } from 'url';


const app = express()
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/auth", authRoutes);
app.use("/reports", reportRoutes);
app.use("/admin", adminRoutes);

app.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({ message: "File too large" });
      return;
    }
  }
  if (res.headersSent) {
    next(err);
    return;
  }
  res.status(500).json({ message: "Server error" });
});

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})