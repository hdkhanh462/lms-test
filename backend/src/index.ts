import "dotenv/config";

import App from "@/app";
import HelloController from "@/controllers/hello.controller";
import ParentController from "@/controllers/parent.controller";
import StudentController from "@/controllers/student.controller";
import ClassController from "@/controllers/class.controller";
import SubscriptionController from "@/controllers/subscription.controller";

const port = process.env.PORT || 3000;
const app = new App(
  [
    new HelloController(),
    new ParentController(),
    new StudentController(),
    new ClassController(),
    new SubscriptionController(),
  ],
  port
);

app.listen();
