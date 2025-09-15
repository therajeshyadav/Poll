import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export const createUser = async (req, res, next) => {
  try {
   
    const { email, name, password } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10); // Hash the password
    const user = await prisma.user.create({
      data: { email, name, passwordHash },
    });

     const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email
    };
    res.status(201).json(safeUser);
  } catch (error) {
    next(error);
  }
};


export const getUser = async (req, res , next) =>{

    try{
        const user = await prisma.user.findUnique({
            where: {id: parseInt(req.params.id)}
        });

        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email
        };
        res.json(safeUser);

    } catch(error){
        next(error);
    }
}