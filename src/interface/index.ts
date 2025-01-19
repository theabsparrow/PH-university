import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: JwtPayload;
      enrolledCourseID?: Types.ObjectId;
    }
  }
}
