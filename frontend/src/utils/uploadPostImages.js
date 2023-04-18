export default async function uploadImages(images) {
  const imageArray = [];
  for (const image of images) {
    const imageData = new FormData();
    imageData.append("file", image);
    imageData.append("upload_preset", "foodshare");
    imageData.append("cloud_name", "dtgv0kheh");
    const data = await fetch(
      "https://api.cloudinary.com/v1_1/dtgv0kheh/image/upload",
      { method: "POST", body: imageData }
    ).then((res) => res.json());
    imageArray.push({ public_id: data.public_id, url: data.secure_url });
  }
  return imageArray;
}