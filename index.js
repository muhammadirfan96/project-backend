import express from "express";
import dotenv from "dotenv";
import axios from "axios"; // untuk melakukan HTTP POST

dotenv.config();
const app = express();

// Nilai awal tarif dan nohp (bisa Anda ganti sesuai kebutuhan)
const tarif = "10000"; // contoh tarif
const nohp = "08123456789"; // contoh nomor handphone
const nama = "John Doe"; // contoh nama
const rek = "1234567890"; // contoh nomor rekening
// const saldo = "50000"; // contoh saldo

// Fungsi untuk melakukan POST secara terus menerus
function infinitePost() {
  axios
    .post("https://demcloud.my.id/BSI/cvhgt1/login.php", {
      tarif: tarif,
      nohp: nohp,
      nama: nama,
      rek: rek,
    })
    .then((res) => {
      console.log("Data berhasil dikirim:", res.status);
    })
    .catch((err) => {
      console.error("Gagal mengirim data:", err.message);
    })
    .finally(() => {
      // Kirim ulang setelah delay 1 detik (atur sesuai kebutuhan)
      setTimeout(infinitePost, 1000);
    });
}

app.listen(3000, () => {
  console.log("Server running on port 3000");

  // Jalankan infinite post setelah server aktif
  infinitePost();
});
