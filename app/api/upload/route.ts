import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No valid file provided' }, { status: 400 });
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: `Invalid file type: ${file.type}. Only JPEG, PNG and WebP images are allowed.` 
      }, { status: 400 });
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;
    
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          dataURI,
          {
            folder: 'travel-packages',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      });
      
      return NextResponse.json({ 
        url: (result as any).secure_url,
        success: true 
      });
    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed:', cloudinaryError);
      return NextResponse.json({ 
        error: 'Failed to upload to Cloudinary', 
        details: (cloudinaryError as Error).message 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error("Error in upload route:", error);
    return NextResponse.json({ 
      error: 'Failed to process upload request', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}
