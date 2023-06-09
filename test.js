const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

const bucketName = 'tanikami-storage';

async function uploadImageToFolder(file, folderName) {
  const bucket = storage.bucket(bucketName);
  const timestamp = Date.now();
  const filename = `${folderName}/${timestamp}_${file.originalname}`;

  const fileOptions = {
    destination: filename,
    metadata: {
      contentType: file.mimetype
    }
  };

  await bucket.upload(file.buffer, fileOptions);

  const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
  return publicUrl;
}

// Contoh penggunaan
const file = {
  originalname: 'example.jpg',
  buffer: Buffer.from('image data') // Ganti dengan data gambar yang sesuai
};

const produkImageUrl = await uploadImageToFolder(file, 'produk');
const pembelianImageUrl = await uploadImageToFolder(file, 'pembelian');
const profilImageUrl = await uploadImageToFolder(file, 'profil');

console.log('URL gambar folder produk:', produkImageUrl);
console.log('URL gambar folder pembelian:', pembelianImageUrl);
console.log('URL gambar folder profil:', profilImageUrl);