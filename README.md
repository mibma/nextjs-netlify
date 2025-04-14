
🛒 Inventory Tracking System – Backend Engineering Case Study

🔧 Tech Stack

- Backend: Node.js, Express.js  
- Database: PostgreSQL (hosted on Aiven)  
- ORM/Query: pg (native PostgreSQL client)  
- Authentication: Basic Auth (`express-basic-auth`)  
- Security & Limits: `express-rate-limit`  

🔹 Stage 1: Single Store Inventory Tracker
- SQLite.
- Models:
  - `products`, `stock_movements`, `store_inventory`
- Supports:
  - Basic stock in/out/adjustments.
  - Manual removals.
- Interface:
  - CLI & basic REST API (Node + Express).
- Storage: SQLite.

---
🔹 Stage 2: Multi-Store, Multi-Supplier Architecture
- Introduced centralized product catalog.
- Added normalized `stores`, `cities`, and `suppliers` tables.
- Enabled filtering stock by store, product, and date.
- Added:
  - Basic Auth via `express-basic-auth`
  - Rate Limiting via `express-rate-limit`
- Switched to hosted PostgreSQL (Aiven).
- RESTful APIs with full CRUD support for:
  - `products`, `stores`, `cities`, `suppliers`, `stock_movements`, `store_inventory`
---

🔹 Stage 3: High-Scale Architecture (1000+ Stores)
Not Implemented due to constraints  but sugggestions are:
- ⚙ Horizontal Scaling via Docker/NGINX (load-balanced API instances)
- 🔁 Asynchronous updates using Kafka:
  - Producers for stock events
  - Consumers for DB sync + audit logging
- 🧠 Read/Write DB separation (primary/replica setup)
- ⚡ Redis caching for fast stock queries
- 🔐 API secured with:
  - Basic Auth
  - Rate limiting
- 📝 Audit logs implemented (separate table + worker)

---

## 📊 Database Schema (Simplified)

| Table                | Description                                  |
|---------------------|----------------------------------------------|
| `products`          | Central product catalog                      |
| `stores`            | Store info linked to `cities`                |
| `cities`            | Normalized location data                     |
| `store_inventory`   | Real-time quantity + reorder levels          |
| `stock_movements`   | Logs stock ins/outs/transfers/sales/etc.     |
| `suppliers`         | Supplier info                                |
| `product_suppliers` | Link table for product-supplier relationships |
| `admin_users`       | Simple user management with roles            |

---

 🔑 API Highlights

| Endpoint                          | Method | Description                      |
|----------------------------------|--------|----------------------------------|
| `products/create`           | POST   | Create new product               |
| `suppliers/getall`          | GET    | List all active suppliers        |
| `stock-movements/create`    | POST   | Record stock in/out/transfer     |
| `stores/get/city/:city_id` | GET    | Get stores in a given city       |
| `admin_users/login`               | POST   | Admin login (future extensible)  |

All APIs are protected via Basic Auth and throttled for abuse prevention.

---

 💡 Design Decisions & Trade-offs

| Decision                         | Reason                                                   |
|----------------------------------|-----------------------------------------------------------|
| PostgreSQL on Aiven              | Reliability, managed backups, and SSL security           |
| `pg` instead of ORM              | More control over raw SQL and better performance          |
| Kafka for async stock sync       | Avoid API bottlenecks and ensure durability               |
| Read/Write DB separation         | Better performance under high concurrent read loads       |
| Redis caching                    | Minimizes DB hits on frequent reads (e.g., stock checks)  |
| Rate limiting (500/min/IP)       | Protects system from brute force and overuse              |

---

## 🚀 How to Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/inventory-tracker.git
cd inventory-tracker/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables in `.env`
```env
DB_HOST=pg-yourhost.aivencloud.com
DB_PORT=12345
DB_USER=avnadmin
DB_PASSWORD=yourpassword
DB_NAME=defaultdb
```

### 4. Run the app
```bash
node server.js
```

## 📦 Future Improvements

- JWT-based auth with refresh tokens
- Role-based access control (RBAC)
- Admin dashboard with data visualization
- Kubernetes for scalable deployment
- Central monitoring using Prometheus + Grafana

## 🧪 Test Strategy

- Manual API testing with Postman
- DB consistency tested via `\dt` and row checks
- Logs validated on Kafka consumer side (Stage 3)

---
 🙌 Author

Muhammad Ibrahim Ayoubi
