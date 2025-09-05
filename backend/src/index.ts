import "dotenv/config";

import App from "@/app";
import HelloController from "@/controllers/hello.controller";

const port = process.env.PORT || 3000;
const app = new App([new HelloController()], port);

app.listen();
