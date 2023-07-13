import { Fields, ValidationParams } from "./types";

export default function validateApiFields<T = any>(validationParams: ValidationParams): (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction) => void;
export { validateApiFields };