# PHU LUC

## Phu luc A. Huong dan cai dat va chay he thong

De chay he thong o moi truong local bang Docker Compose va cong khai website qua domain demo, can chuan bi Docker/Docker Compose, file `.env` phu hop va Cloudflare Tunnel. Sau do thuc hien theo thu tu sau:

### Buoc 1. Chay cac service bang Docker Compose

Mo PowerShell tai thu muc goc du an va chay lenh:

```powershell
docker compose up --build
```

Lenh tren se khoi dong cac service can thiet cua he thong, bao gom frontend va backend. Trong qua trinh demo, can giu cua so PowerShell nay mo de cac container tiep tuc hoat dong.

### Buoc 2. Kiem tra website local

Sau khi cac service khoi dong thanh cong, truy cap cac dia chi local sau de kiem tra:

**Bang PL.1. Dia chi truy cap khi chay local**

| Thanh phan | URL mac dinh |
| --- | --- |
| Frontend | `http://localhost:3000` |
| Backend | `http://localhost:8080` |
| Swagger UI | `http://localhost:8080/swagger-ui.html` |

### Buoc 3. Chay Cloudflare Tunnel

Mo them mot cua so PowerShell thu hai va chay lenh:

```powershell
cloudflared tunnel run homi
```

Lenh nay dung de mo Cloudflare Tunnel, dua website dang chay tren may local ra domain public. Trong qua trinh demo, can giu cua so PowerShell chay tunnel mo lien tuc.

### Buoc 4. Truy cap website qua domain public

Sau khi tunnel chay thanh cong, truy cap website qua dia chi:

**Bang PL.2. Dia chi truy cap khi chay qua tunnel**

| Thanh phan | URL |
| --- | --- |
| Website public | `https://thuenhahomi.id.vn` |

Thu tu chay bat buoc khi demo:

```text
1. Mo Docker Desktop.
2. Chay docker compose up --build.
3. Chay cloudflared tunnel run homi.
4. Truy cap https://thuenhahomi.id.vn.
```

Neu khong chay Cloudflare Tunnel, website chi truy cap duoc trong may local qua `http://localhost:3000` va domain public se khong hoat dong.
