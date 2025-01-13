import { User } from '../user/user.model';

export const isUserExists = async (id: string) => {
  const isUserExistsByCustomID = await User.findOne({ id }).select('+password');
  return isUserExistsByCustomID;
};
