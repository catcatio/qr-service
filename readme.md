# qr-service

qr code generator service

<img alt="example" src="./example/logo.png" width="250">

## Run

```shell
npm i

npm run dev
```

GET `http://localhost:3000/qr?d=https://github.com/catcatio/qrservice`

POST `http://localhost:3000/qr`

```json
{
  "payload": "https://github.com/catcatio/qrservice"
}
```
