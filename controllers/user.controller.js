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



export const getuserById = async(req , res)=>{

  try{
   
    const {id } = req.query;
    

    const existUser = await User.findOne({_id : id})

    if(!existUser){
      return res.status(404).json({success : false , message : "User not found"})
    }

    res.status(200).json({success : true , message : "User found successfully" , data : existUser})
   
  }catch(error){
    return res.status(500).json({success : false , message : "Internal server error" , error : error.message})

  }

}

export const getallUser = async(req, res)=>{
  try{
    const existUser = await User.find();
    const {role , page = 1 , limit =10 } = req.query;
    if(!existUser){
      return res.status(404).json({success : false , message : "user not found"})
    }


    const filter = {}
    if(role){
      filter.role = role;
    }

   const pageNum = Math.max(Number(page))
   const limitNum = Math.max(Number(limit))

   const skip = (pageNum - 1) * pageNum;


   const totalDocs = await User.countDocuments(filter)

   const user = await User.find(filter)
     .sort({ createdAt: -1 })
   .skip(skip)
   .limit(limitNum)

   const totalPages = Math.ceil(totalDocs / limitNum)

   
  res.status(200).json({success: true , data : user,
    currentPage : pageNum,
    limit : limitNum,
    totalPages,

  })
    res.status(200).json({success : true , message : "All User found Successfully" , data : existUser})

  }catch(error){
    return res.status(500).json({success : false , message : "Internal server error" , error : error.message})
  }
}


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

export const logoutUser = async(req, res)=>{

  res.clearCookie("token",
    {
      httpOnly : true,
      sameSite : "strict"
    }

  )

  res.status(200).json({success: true , message : "User logout Successfully"})

}