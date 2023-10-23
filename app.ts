import express, {Router} from "express";
import {router as loginRouter} from "./server/routes/auth/login";
import {router as registerRouter} from "./server/routes/auth/register";
import {router as userRouter} from "./server/routes/users/[id]/index";
import {router as userSchedulesRouter} from "./server/routes/users/[id]/schedules";
import {router as scheduleRouter} from "./server/routes/schedule/index";

const app = express()
const port = 3000

app.use(express.json());
app.use("/api/v1/auth", loginRouter as Router);
app.use("/api/v1/auth", registerRouter as Router);
app.use("/api/v1/users", userRouter as Router);
app.use("/api/v1/users", userSchedulesRouter as Router);
app.use("/api/v1/schedule", scheduleRouter as Router);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})