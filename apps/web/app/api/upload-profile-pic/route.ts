import { authOptions } from '@/lib/auth';
import prisma from '@repo/db/client';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });
    try {
        const uploadsFolder = "users";
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const userId = formData.get('userId') as string;

        const session = await getServerSession(authOptions);
        if (!session || userId !== session.user.id) {
            return Response.json({
                msg: "You are unauthorized to edit profile"
            }, { status: 400 })
        }
        if (!file || !(file instanceof File)) {
            return Response.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const fileBuffer = await file.arrayBuffer();
        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    { resource_type: 'auto', folder: uploadsFolder },
                    (error, result) => {
                        if (error || !result) reject(error);
                        else resolve(result);
                    },
                )
                .end(Buffer.from(fileBuffer));
        });

        await prisma.user.update({
            where: {
                id: userId
            }, data: {
                image: result.secure_url
            }
        })

        return Response.json({ secure_url: result.secure_url });
    } catch (error) {
        console.error('Error uploading file:', error);
        return Response.json({ error: 'Error uploading file' }, { status: 500 });
    }
}