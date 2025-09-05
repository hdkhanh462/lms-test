import { Request, Response } from "express";

import { BaseController } from "@/controllers/abstractions/base.controller";

export default class HelloController extends BaseController {
  public path = "/hello";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.sayHello);
  }
  sayHello = async (request: Request, response: Response) => {
    response.json({
      message: "Hello from the HelloController!",
    });
  };
}
