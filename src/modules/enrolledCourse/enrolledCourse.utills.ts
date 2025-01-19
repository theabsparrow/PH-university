import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import { OfferedCourse } from "../offeredCourse/offeredCourse.model";
import { Types } from "mongoose";


 export const getOfferCourse = async (id: Types.ObjectId) => {
    const isOfferedCourseExists = await OfferedCourse.findById(id);
    if (!isOfferedCourseExists) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'this offer course does not exists'
      );
    }
    return isOfferedCourseExists
}