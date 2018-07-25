# qr-service

qr code generator service

![example](./example/logo.png)

## Run

```shell
npm i

npm run dev
```

POST `http://localhost:3000/qr`

```json
{
  "payload": "https://github.com/catcatio/qrservice"
}
```
