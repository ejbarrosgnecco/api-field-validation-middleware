import { Fields, ValidationParams } from "./types";
import { Response, Request, NextFunction } from "express"

export default function validateApiFields<T = any>(validationParams: ValidationParams): (req: Request, res: Response, next: NextFunction) => void;
export { validateApiFields };