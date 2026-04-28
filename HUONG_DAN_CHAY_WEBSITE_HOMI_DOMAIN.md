# HUONG DAN CHAY WEBSITE HOMI BANG DOCKER VA CLOUDFLARE TUNNEL

## 1. Muc tieu

File nay dung de chay website Homi khi demo/bao ve do an ma khong can thue VPS.

Website se chay theo mo hinh:

```txt
Docker local tren may tinh -> Cloudflare Tunnel -> Domain public
```

Domain dang dung:

```txt
https://thuenhahomi.id.vn
```

## 2. Dieu kien can co

Truoc khi chay, may tinh can co:

- Docker Desktop da cai va dang mo.
- Cloudflare Tunnel da cai bang `cloudflared`.
- Domain `thuenhahomi.id.vn` da nam trong Cloudflare.
- Tunnel Cloudflare ten `homi` da duoc tao.
- File cau hinh tunnel da co tai:

```txt
C:\Users\Minh\.cloudflared\config.yml
```

Noi dung cau hinh dung:

```yml
tunnel: 4e13ecf3-e990-46f7-b538-371b7baa77a1
credentials-file: C:/Users/Minh/.cloudflared/4e13ecf3-e990-46f7-b538-371b7baa77a1.json

ingress:
  - hostname: thuenhahomi.id.vn
    service: http://localhost:3000
  - service: http_status:404
```

## 3. Cach chay website

### Buoc 1: Mo Docker Desktop

Mo Docker Desktop truoc va doi den khi thay trang thai Docker Engine dang chay.

Neu Docker Desktop chua chay, lenh `docker compose up --build` co the bi loi.

### Buoc 2: Chay Frontend, Backend va MySQL

Mo PowerShell thu nhat, chay:

```powershell
cd "C:\Users\Minh\Documents\ChoThuePhongTroHomi"
docker compose up --build
```

Giu cua so PowerShell nay mo trong suot qua trinh demo.

Sau khi chay xong, kiem tra website local:

```txt
http://localhost:3000
```

Kiem tra API backend:

```txt
http://localhost:8080/api/v1/rooms
```

### Buoc 3: Chay Cloudflare Tunnel

Mo PowerShell thu hai, chay:

```powershell
cloudflared tunnel run homi
```

Giu cua so PowerShell nay mo trong suot qua trinh demo.

Neu tunnel chay dung, log se co cac dong gan giong:

```txt
INF Starting tunnel
INF Registered tunnel connection
```

### Buoc 4: Mo website bang domain

Mo trinh duyet va truy cap:

```txt
https://thuenhahomi.id.vn
```

Kiem tra cac chuc nang chinh:

- Trang chu
- Tim phong
- Chi tiet phong
- Dang nhap
- Dang tin
- Khu chu tro
- Khu admin
- Upload/hiển thị anh phong

## 4. Thu tu bat buoc khi demo

Can chay dung thu tu:

```txt
1. Mo Docker Desktop
2. Chay docker compose up --build
3. Chay cloudflared tunnel run homi
4. Mo https://thuenhahomi.id.vn
```

Khong tat 2 cua so PowerShell dang chay Docker va Tunnel.

## 5. Kiem tra trang thai khi co loi

### Kiem tra container Docker

Mo PowerShell tai thu muc du an:

```powershell
cd "C:\Users\Minh\Documents\ChoThuePhongTroHomi"
docker compose ps
```

Trang thai mong muon:

```txt
homi-frontend  Up
homi-backend   Up
homi-mysql     Up (healthy)
```

### Kiem tra frontend local

```powershell
(Invoke-WebRequest http://localhost:3000 -UseBasicParsing).StatusCode
```

Ket qua dung:

```txt
200
```

### Kiem tra backend local

```powershell
(Invoke-WebRequest http://localhost:8080/api/v1/rooms -UseBasicParsing).StatusCode
```

Ket qua dung:

```txt
200
```

### Kiem tra tunnel

```powershell
cloudflared tunnel list
```

Can thay tunnel:

```txt
homi
```

## 6. Loi thuong gap

### Loi 502 Bad Gateway tren domain

Nguyen nhan thuong gap:

- Chua chay Docker Compose.
- Frontend local `http://localhost:3000` chua mo duoc.
- Chua chay `cloudflared tunnel run homi`.
- File `config.yml` sai domain hoac sai service.

Cach sua:

```powershell
cd "C:\Users\Minh\Documents\ChoThuePhongTroHomi"
docker compose up --build
```

Sau do mo PowerShell khac:

```powershell
cloudflared tunnel run homi
```

### Loi Docker khong nhan lenh

Neu gap loi:

```txt
docker is not recognized
```

Can mo Docker Desktop hoac cai Docker Desktop.

### Loi Cloudflare Tunnel khong nhan lenh

Kiem tra:

```powershell
cloudflared --version
```

Neu khong nhan lenh, cai lai:

```powershell
winget install --id Cloudflare.cloudflared
```

### Loi domain van tro ve IP cu

Vao Cloudflare:

```txt
DNS -> Records
```

Dam bao khong con record cu:

```txt
A thuenhahomi.id.vn -> 112.213.89.148
A www -> 112.213.89.148
```

Domain chinh nen duoc route qua Cloudflare Tunnel.

## 7. Tat website sau khi demo

Trong cua so PowerShell dang chay tunnel, nhan:

```txt
Ctrl + C
```

Trong cua so PowerShell dang chay Docker Compose, nhan:

```txt
Ctrl + C
```

Neu muon dung va xoa container dang chay:

```powershell
cd "C:\Users\Minh\Documents\ChoThuePhongTroHomi"
docker compose down
```

## 8. Ghi chu khi bao ve do an

Co the trinh bay voi giang vien:

```txt
Do day la do an hoc thuat, em dong goi he thong bang Docker Compose de chay day du Frontend, Backend va MySQL tren moi truong local. De demo domain public ma khong can thue VPS, em dung Cloudflare Tunnel tro domain ve ung dung local. Khi trien khai production thuc te, co the dua cung cau truc Docker Compose nay len VPS hoac cloud server.
```
