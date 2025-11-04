import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'
dotenv.config();

import userRoute from "./route/user.route.js"


import summaryRoute from "./route/summaryroute.js";


const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
// app.use(cors({
//     origin: [
//       "http://localhost:5173",
//       "https://your-frontend-name.onrender.com" 
//     ],
  
//   credentials: true, 
// }));
app.use(cors({
  origin: "https://profound-froyo-7b3e3f.netlify.app", // ✅ your Netlify URL
  credentials: true, // ✅ allow cookies to pass
}));



const PORT =process.env.PORT|| 3000;
const DB_URI= process.env.MONGO_URI;
app.use("/summarize", summaryRoute);

try{
  await  mongoose.connect(DB_URI)
    console.log("connected to mongodb")
}
catch(e){
    console.error(e)
}


app.use("/user",userRoute)
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
