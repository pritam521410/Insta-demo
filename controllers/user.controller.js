import User from "../model/user.model.js";

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!email) {
      return res.status(404).json({
        success: false,
        message: "email field are required",
      });
    }

    const existemail = await User.findOne({ email });

    if (existemail) {
      return res.status(404).json({
        success: false,
        message: "Already mail exist try another mail",
      });
    }

    const user = new User({ name, email, phone, password, role });

    await user.save();

    res.status(200).json({
      success: true,
      message: "user created Successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};
