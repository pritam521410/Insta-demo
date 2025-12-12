import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

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




export const loginUser = async(req, res)=>{
  try{

    const{email , password } = req.body;
    const existUser = await User.findOne({email});

    if(!existUser){
      return res.status(404).json({success : false , message : "user not found"})
    }

    const isMatch = await bcrypt.compare(password , existUser.password )

    if(!isMatch){
      return res.status(404).json({success : false , message : "Invalid Credentials"})
    }

    const token = jwt.sign(
      {
        id : existUser._id,
        role : existUser.role
      },

      process.env.JWT_SECRET,
      {expiresIn : "7d"}

    )

    res.cookie("token" , token ,{
      httpOnly : true,
      sameSite : "Strict",
      maxAge : 24*60*60*1000,

    })

    res.status(200).json({
      success : true,
      message : "Login Successfully",
      data : {
        email : existUser.email,
        id : existUser._id,
        name : existUser.name
      }
    })


  }catch(error){
    return res.status(500).json({success : false , message : "Internal server error" , error : error.message })
  }

}