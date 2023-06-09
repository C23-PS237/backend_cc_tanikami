# C23-PS237 Back-End TaniKami

## General
This is the Back-End API for our app TaniKami. This API is deployed using Google Cloud Platform's Cloud Run service and connected to the Cloud SQL database.

This APIs developed using:
- Node.Js v18.13.0
- Express v4.18.2
- MySQL v8.0
- Google Cloud Run
- Google Cloud Storage

### How to deploy the APIs
- Clone this project to your GCP project’s repository
```bash
git clone https://github.com/C23-PS237/backend_cc_tanikami
``` 
- Create Cloud SQL database for MySQL using the command provided on this link
database.md
- Set up the `connection.js` according to your database
- Create a Public Google Cloud Bucket and set up the `profilupload.js`, `produkupload.js`, and `transaksiupload.js` accordingly
- Generate the container image using the provided Dockerfile
```bash
gcloud builds submit --tag gcr.io/<project_id>/tanikami
```
- Deploy the container image using Cloud Run
```bash
gcloud run deploy --image gcr.io/<project-id>/tanikami
```

## APIs Documentation
<details>
<summary>POST user</summary>
Request:

- Method: `POST`
- Endpoint: `/user`
- Body:

| KEY | VALUE |
| --- | --- |
| `profil` | IMAGE FILE |
| `id_ktp` | string |
| `nama` | string |
| `email` | string |
| `password` | string |
| `telepon` | string |
| `alamat_regist` | string |
| `alamat_penerima` | string NULLABLE |
| `gender` | number `0/1` |
| `usia` | number |
| `status` | number `0/1` |

Response:
```json
{
  "payload": {
    "isSuccess": "number",
     "id": "number"
  },
  "message": "user added"
}
```
</details>
<details>
<summary>GET user by id_ktp</summary>
Request:

- Method: `GET`
- Endpoint: `/user/<id_ktp>`
- Body: `none`

Response:
```json
{
  "payload": {
    "id_ktp": "string",
    "profil": "IMAGE URL",
    "nama": "string",
    "email": "string",
    "password": "string",
    "telepon": "string",
    "alamat_regist": "string",
    "alamat_penerima": "string NULLABLE",
    "Gender": "number 0/1",
    "usia": "number",
    "status": "number 0/1"
  },
  "message": "user detail"
}
```
</details>
<details>
<summary>PUT user by id_ktp</summary>
Request:

- Method: `PUT`
- Endpoint: `/user/<id_ktp>`
- Body:

| KEY | VALUE |
| --- | --- |
| `profil` | IMAGE FILE |
| `id_ktp` | string |
| `nama` | string |
| `email` | string |
| `password` | string |
| `telepon` | string |
| `alamat_regist` | string |
| `alamat_penerima` | string NULLABLE |
| `gender` | number `0/1` |
| `usia` | number |
| `status` | number `0/1` |

Response:
```json
{
  "payload": {
    "isSuccess": "number",
    "message": "(Rows matched: 1 Changed: 1 Warnings: 0"
  },
  "message": "user updated"
}
```
</details>
<details>
<summary>POST produk</summary>
Request:

- Method: `POST`
- Endpoint: `/produk`
- Body:

| KEY | VALUE |
| --- | --- |
| `gambar_produk` | IMAGE FILE |
| `id_ktp` | string |
| `nama_produk` | string |
| `besaran_stok` | string |
| `stok` | number |
| `harga` | number |
| `deskripsi_produk` | string |
| `nama_bank` | string |
| `rek_penjual` | string |

Response:
```json
{
  "data": {
    "isSuccess": "boolean",
     "id": "number"
  },
  "message": "Product added"
}
```
</details>
<details>
<summary>GET produk</summary>
Request:

- Method: `GET`
- Endpoint: `/produk`
- Body: `none`

Response:
```json
{
  "payload": ["LIST OF ALL PRODUCTS"]
  "message": "all products"
}
```
</details>
<details>
<summary>GET produk by id_produk</summary>
Request:
  
- Method: `GET`
- Endpoint: `/produk/<id_produk>`
- Body: `none`

Response:
```json
{
  "payload": {
    "id_produk": "number",
    "id_ktp": "string",
    "nama_produk": "string",
    "besaran_stok": "string",
    "stok": "number",
    "harga": "number",
    "Gambar_produk": "IMAGE URL",
    "deskripsi_produk": "string",
    "nama_bank": "string",
    "rek_penjual": "string",
    "timestamp": "string"
  },
  "message": "product detail"
}
```
</details>
<details>
<summary>GET produk by id_ktp</summary>
Request:

- Method: `GET`
- Endpoint: `/produk/ktp/<id_ktp>`
- Body: `none`

Response:
```json
{
  "payload": ["LIST OF USER'S PRODUCTS"]
  "message": "user's product"
}
```
</details>
<details>
<summary>PUT produk by id_produk</summary>
Request:

- Method: `PUT`
- Endpoint: `/produk/<id_produk>`
- Body:

| KEY | VALUE |
| --- | --- |
| `gambar_produk` | IMAGE FILE |
| `nama_produk` | string |
| `besaran_stok` | string |
| `stok` | number |
| `harga` | number |
| `deskripsi_produk` | string |
| `nama_bank` | string |
| `rek_penjual` | string |

Response:
```json
{
  "payload": {
    "isSuccess": "number",
    "message": "(Rows matched: 1 Changed: 1 Warnings: 0"
  },
  "message": "product updated"
}
```
</details>
<details>
<summary>DELETE produk by id_produk</summary>
Request:

- Method: `DELETE`
- Endpoint: `/produk/<id_produk>`
- Body: `none`

Response:
```json
{
  "payload": {
    "isSuccess": "number",
    "message": ""
  },
  "message": "product deleted"
}
```
</details>
<details>
<summary>POST pembelian</summary>
Request:

- Method: `POST`
- Endpoint: `/pembelian`
- Body:

| KEY | VALUE |
| --- | --- |
| `bukti_transfer` | IMAGE FILE |
| `id_ktp` | string |
| `id_produk` | number |
| `alamat_penerima` | string NULLABLE |
| `harga` | number |
| `jumlah_dibeli` | number |
| `biaya_pengiriman` | number |
| `pajak` | number |
| `biaya_admin` | number |
| `biaya_total` | number |
| `status_pembayaran` | number `0/1` |
| `status_pengiriman` | number `0/1` |
| `id_penjual` | string |



Response:
```json
{
    "data": {
        "isSuccess": "boolean",
        "id": "number"
    },
    "message": "purchased"
}
```
</details>
<details>
<summary>PUT pembelian by id_transaksi</summary>
Request:

- Method: `PUT`
- Endpoint: `/pembelian/<id_transaksi>`
- Body:

| KEY | VALUE |
| --- | --- |
| `bukti_transfer` | IMAGE FILE |
| `id_ktp` | string |
| `id_produk` | number |
| `alamat_penerima` | string NULLABLE |
| `harga` | number |
| `jumlah_dibeli` | number |
| `biaya_pengiriman` | number |
| `pajak` | number |
| `biaya_admin` | number |
| `biaya_total` | number |
| `status_pembayaran` | number `0/1` |
| `status_pengiriman` | number `0/1` |
| `id_penjual` | string |



Response:
```json
{
    "payload": {
        "isSuccess": "number",
        "id": "number"
    },
    "message": "transaction updated"
}
```
</details>
<details>
<summary>GET pembelian by id_transaksi </summary>
Request:

- Method: `GET`
- Endpoint: `/pembelian/<id_transaksi>`
- Body: `none`

Response:
```json
{
    "payload": {
        "id_transaksi": "number",
        "id_produk": "number",
        "id_ktp": "string",
        "alamat_penerima": "string",
        "harga": "number",
        "jumlah_dibeli": "number",
        "biaya_pengiriman": "number",
        "pajak": "number",
        "biaya_admin": "number",
        "biaya_total": "number",
        "status_pembayaran": "number 0/1",
        "status_pengiriman": "number 0/1",
        "bukti_transfer": "IMAGE URL",
        "created_at": "string",
        "updated_at": "string",
        "id_penjual": "string"
    },
    "message": "transaction detail"
}
```
</details>
<details>
<summary>GET pembelian by id_ktp</summary>
Request:

- Method: `GET`
- Endpoint: `/pembelian/ktp/<id_ktp>`
- Body: `none`

Response:
```json
{
    "payload": ["LIST OF USER'S TRANSACTIONS"],
    "message": "user's transactions"
}
```
</details>
<details>
<summary>GET pembelian by id_penjual</summary>
Request:

- Method: `GET`
- Endpoint: `/pembelian/penjual/<id_penjual>`
- Body: `none`

Response:
```json
{
    "payload": [
        {
            "id_transaksi": "number",
            "id_produk": "number",
            "id_ktp": "string",
            "alamat_penerima": "string",
            "harga": "number",
            "jumlah_dibeli": "number",
            "biaya_pengiriman": "number",
            "pajak": "number",
            "biaya_admin": "number",
            "biaya_total": "number",
            "status_pembayaran": "number 0/1",
            "status_pengiriman": "number 0/1",
            "bukti_transfer": "IMAGE URL",
            "created_at": "string",
            "updated_at": "string",
            "id_penjual": "string"
        }
    ],
    "message": "seller's transactions"
}
```
</details>
<details>
<summary>DELETE pembelian by id_transaksi</summary>
Request:

- Method: `DELETE`
- Endpoint: `/pembelian/<id_transaksi>`
- Body: `none`

Response:
```json
{
    "payload": {
        "isSuccess": "number",
        "message": ""
    },
    "message": "transaction deleted"
}
```
</details>
<details>
<summary>GET artikel</summary>
Request:

- Method: `GET`
- Endpoint: `/artikel`
- Body: `none`

Response:
```json
{
  "payload": ["LIST OF ALL ARTICLES"]
  "message": "all articles"
}
```
</details>

<details>
<summary>GET artikel by id_artikel</summary>
Request:

- Method: `GET`
- Endpoint: `/artikel/<id_artikel>`
- Body: `none`

Response:
```json
{
    "payload": {
        "id_artikel": "number",
        "judul": "string",
        "body": "string",
        "gambar_artikel": "IMAGE URL",
        "author": "string",
        "timestamp": "string"
    },
    "message": "article detail"
}
```
</details>
  
## Contributed by - Cloud Computing student :
- [Meti Hervina](https://www.linkedin.com/in/methervina/) `C360DSY3029`
- [Hari Iskandar](https://www.linkedin.com/in/hskndr/) `C360DSX3030`
