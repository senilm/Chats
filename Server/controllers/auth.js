const {
  BadRequestError,
  NotFoundError,
  Unauthenticated,
} = require("../errors");
const User = require("../model/user");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new BadRequestError("Please provide Email");
  }
  if (!password) {
    throw new BadRequestError("Please provide password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isMatch = await user.comparePwd(password);
  if (!isMatch) {
    throw new Unauthenticated("Invalid credentials");
  }
  const accessToken = user.genAccessJWT();
  const refreshToken = user.genRefreshJWT();
  delete user.password;
  return res.status(200).json({ accessToken, refreshToken, user });
};

const register = async (req, res) => {
  const user = await User.create(req.body);
  // throw new NotFoundError('Not Found')
  delete user.password;
  return res.status(200).json(user);
};

const setAvatar = async (req, res) => {
  const userId = req.params.id;
  const avatarImage = req.body.image;
  const userData = await User.findByIdAndUpdate(
    userId,
    {
      isAvatarImageSet: true,
      avatarImage: avatarImage,
    },
    { new: true }
  );
  if (!userData) {
    throw new BadRequestError("Please try again");
  }
  return res.status(200).json(userData.avatarImage);
};

const getAllUser = async (req, res) => {
  const users = await User.find({ _id: { $ne: req.params.id } }).select([
    "email",
    "name",
    "avatarImage",
    "_id"
  ]);
  if (users.length === 0) {
    return res.status(400).json({ msg: "No Users" });
  }
  res.status(200).json(users);
};


const getUser = async (req,res)=>{
  const name=  req.params.name
  if(!name){
    throw new BadRequestError("Please provide name")
  }
  const users = await User.find({name}).select([
      "email",
      "name",
      "avatarImage",
      "_id"
    ]);
    if(!users){
      throw new NotFoundError("user not found")
    }
    return res.status(200).json(users)
  }
  


module.exports = { login, register, setAvatar, getAllUser ,getUser};
