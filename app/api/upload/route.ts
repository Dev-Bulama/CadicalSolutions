import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "cadical-docs",
        },
        (err, res) => {
          if (err) return reject(err);
          resolve(res);
        }
      )
      .end(buffer);
  });

  return Response.json({
    url: result.secure_url,
    public_id: result.public_id,
  });
}