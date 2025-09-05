import { prisma } from "@/lib/prisma";
import { Router } from "express";

export abstract class BaseController {
  public router: Router;
  public prisma = prisma;

  constructor() {
    this.router = Router();
  }
  public abstract initializeRoutes(): void;
}
