import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'

import { v2 as cloudinary } from 'cloudinary' 

cloudinary.config(process.env.CLOUDINARY_URL || '')

type Data = {
  message: string
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return uploadFile(req, res)
    default:
      return res.status(200).json({ message: 'Example' }) 
  }
}

const saveFile = async(file: formidable.File) => {
  // const data = fs.readFileSync(file.filepath)

  // fs.writeFileSync(`./public/${file.originalFilename}`,data)
  // fs.unlinkSync(file.filepath)
  // return
  const data = await cloudinary.uploader.upload( file.filepath)
  return data.secure_url
}

const parseFiles = async(req: NextApiRequest): Promise<string> => {
 
  return new Promise( (resolve, reject) => {

    const form = new formidable.IncomingForm()
    form.parse(req, async(err, fields, files)=> {

      if(err){
        return reject(err)
      }

      const filePath : any = await saveFile(files.file as formidable.File)
      resolve(filePath)
    })
  })
}

const uploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

  try {
    const imageUrl = await parseFiles(req)
    return res.status(200).json({message :  imageUrl})
  } catch (error) {
    console.log(error)
  }
}