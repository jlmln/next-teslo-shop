import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose'

//Database
import { db } from '@/database'
import { User } from '@/models'

//Interfaces
import { IUser } from '@/interfaces'


type Data =
| { message: string }
| IUser[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getUsers(req,res)
    case 'PUT':
      return updateUser(req,res)
    default:
      res.status(400).json({ message: 'Bad request' })
  }
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await db.connect()
    const users = await User.find().select('-password').lean()
    await db.disconnect()

    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({message: 'Error en servidor'})
  }
}

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

  const { userId = '', role = '' } = req.body

  if(!isValidObjectId(userId)){
    return res.status(404).json({message: 'No existe usuario por ese id'})
  }

  const validRoles = ['admin','client','super-user','SEO']

  if (!validRoles.includes(role)) {
    return res.status(400).json({message: 'Rol no permitido: '+ validRoles.join(', ')})
  }

  try {
    await db.connect()
    const user = await User.findById( userId )

    if(!user){
      await db.disconnect()
      return res.status(404).json({message: 'Usuario no encontrado: '+ userId})
    }

    user.role = role
    await user.save()
    await db.disconnect()

    return res.status(201).json({message: 'Usuario actualizado'})
    
  } catch (error) {
    return res.status(500).json({message: 'Error en servidor'})
  }


}