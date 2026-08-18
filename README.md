# Bazaario -- E-Commerce Product Catalog (Learning Project)

A simplified, Flipkart-style product catalog web app built to practice
full-stack authentication. Users can browse products, search and filter by
category, view product details, and register/log in to see a protected
profile page. **There is no cart or checkout** -- this project exists purely
to practice authentication and a browsing UI.

> ⚠️ **This is a learning/testing project.** It intentionally runs over
> plain HTTP (no SSL/TLS) and uses development-friendly defaults. Do not
> use these settings as-is for a real production system handling real user
> data -- see [Security notes](#security-notes-read-before-any-real-deployment)
> at the bottom.

---

## Tech stack

| Layer          | Technology                                             |
|----------------|---------------------------------------------------------|
| Backend        | Node.js + Express.js                                    |
| Database       | MongoDB + Mongoose                                       |
| Frontend       | Plain HTML, CSS, vanilla JavaScript (no build step)      |
| Auth           | JWT stored in an httpOnly cookie (`secure: false` for HTTP) |
| Process manager| PM2 (production)                                         |
| Reverse proxy  | Nginx (production)                                        |

---

## Project structure

```
ecommerce-catalog/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── products.js
│   ├── middleware/
│   │   └── auth.js
│   ├── seed/
│   │   └── seedProducts.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── product.html
│   ├── login.html
│   ├── register.html
│   ├── profile.html
│   ├── css/style.css
│   └── js/
│       ├── api.js
│       ├── auth.js
│       ├── products.js
│       └── profile.js
└── README.md
```

---

## 1. Local setup (development)

### Prerequisites

- **Node.js** 18 or newer (`node -v` to check)
- **MongoDB** running locally, or a connection string to a remote instance
  (e.g. MongoDB Atlas)
- **npm** (comes with Node.js)

### Install Node.js and MongoDB (Ubuntu example)

```bash
# Node.js 20.x via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# MongoDB Community Edition
sudo apt-get install -y gnupg curl
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl enable --now mongod
```

### Install dependencies

```bash
cd ecommerce-catalog/backend
npm install
```

### Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and set values as needed:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=replace_this_with_a_long_random_secret_string
```

Generate a strong random secret if you'd like:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Seed the database with sample products

This inserts ~30 realistic dummy products with placeholder images from
picsum.photos and pre-written marketing-style descriptions (these are
hand-written text templates for testing, not calls to a live AI API):

```bash
npm run seed
```

You should see output like `Done! Seeded 30 products.`

### Run the app

Development (auto-restarts on file changes, requires `nodemon`):

```bash
npm run dev
```

Or plain Node:

```bash
npm start
```

The app is served entirely from Express at:

```
http://localhost:5000
```

(Both the API at `/api/...` and the static frontend pages are served from
this single Node process -- no separate frontend server needed.)

---

## 2. Deploying to an Ubuntu server (PM2 + Nginx, plain HTTP)

This section walks through deploying to a fresh Ubuntu server (20.04/22.04/24.04)
so it's reachable at `http://your-server-ip/` or `http://your-domain/` over
plain HTTP -- no SSL certificate required for testing.

### Step 1 -- Install Node.js, MongoDB, and Nginx on the server

```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# MongoDB (see commands in the Local Setup section above)

# Nginx
sudo apt-get update
sudo apt-get install -y nginx
```

### Step 2 -- Copy the project to the server

From your local machine:

```bash
scp -r ecommerce-catalog your-user@your-server-ip:/home/your-user/
```

Or clone/pull it via git if you've pushed it to a repository.

### Step 3 -- Install dependencies and configure environment

```bash
cd /home/your-user/ecommerce-catalog/backend
npm install --production
cp .env.example .env
nano .env   # set PORT, MONGODB_URI, and a strong JWT_SECRET
```

### Step 4 -- Seed the database (first deploy only)

```bash
npm run seed
```

### Step 5 -- Install PM2 and start the app

PM2 keeps the Node process running in the background, restarts it if it
crashes, and can start it automatically on server reboot.

```bash
sudo npm install -g pm2

# Start the app under PM2, naming the process "bazaario"
pm2 start server.js --name bazaario

# Save the current process list so PM2 can restore it on reboot
pm2 save

# Generate and run the startup script for your OS (follow the printed instructions)
pm2 startup
```

Useful PM2 commands:

```bash
pm2 status              # see running processes
pm2 logs bazaario        # tail logs
pm2 restart bazaario     # restart after a code update
pm2 stop bazaario        # stop the app
```

By default, the app listens on `127.0.0.1:5000` (or whatever `PORT` you set
in `.env`) -- it is **not** exposed directly to the internet. Nginx will
sit in front of it as a reverse proxy on port 80.

### Step 6 -- Configure Nginx as a reverse proxy (HTTP only, no SSL)

Create a new Nginx site config:

```bash
sudo nano /etc/nginx/sites-available/bazaario
```

Paste the following, replacing `your-domain-or-ip` with your server's
domain name or public IP address:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain-or-ip;

    # Increase if you plan to allow larger request bodies later
    client_max_body_size 5M;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;

        # Forward useful headers to the Node app
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Keep-alive / websocket-friendly headers (harmless even without websockets)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Enable the site and reload Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/bazaario /etc/nginx/sites-enabled/
sudo nginx -t          # test the config for syntax errors
sudo systemctl reload nginx
```

If this is a fresh server, also allow HTTP traffic through the firewall:

```bash
sudo ufw allow 'Nginx HTTP'
# or, if not using the Nginx app profile:
sudo ufw allow 80/tcp
```

### Step 7 -- Verify

Visit `http://your-domain-or-ip/` in a browser. You should see the Bazaario
product listing page. Try registering an account, logging in, and visiting
"Profile" to confirm cookie-based auth works end-to-end through Nginx.

### About SSL

No SSL/TLS is configured here on purpose, per the testing requirements of
this project -- the app is designed to run entirely over plain HTTP,
including the `secure: false` flag on the auth cookie. If you later want to
add HTTPS (recommended for anything beyond local testing), the common path
is:

1. Point a real domain name at the server.
2. Install Certbot (`sudo apt-get install certbot python3-certbot-nginx`).
3. Run `sudo certbot --nginx -d your-domain` to get a free certificate and
   have it auto-configure Nginx for HTTPS.
4. Update `backend/routes/auth.js` to set `secure: true` on the cookie
   options once HTTPS is confirmed working, so the cookie is only sent over
   encrypted connections.

This project deliberately does **not** include any HTTPS redirect logic, so
it keeps working over plain HTTP if you choose not to add SSL.

---

## 3. API documentation

All endpoints are prefixed with `/api`. Authenticated endpoints read a JWT
from an httpOnly cookie named `token`, which is set automatically by the
browser after login/register -- no `Authorization` header is needed from
the frontend.

### Auth -- `/api/auth`

| Method | Path              | Auth required | Description                                  |
|--------|-------------------|:--------------:|-----------------------------------------------|
| POST   | `/api/auth/register` | No | Create a new account. Body: `{ username, email, password }`. Sets the auth cookie and returns the created user. |
| POST   | `/api/auth/login`    | No | Log in. Body: `{ email, password }`. Sets the auth cookie and returns the user. |
| POST   | `/api/auth/logout`   | No | Clears the auth cookie. |
| GET    | `/api/auth/me`       | Yes | Returns the currently logged-in user's `{ id, username, email }`. |

**Error responses** use the shape `{ "error": "message" }` with an
appropriate status code (`400` validation, `401` bad credentials/not
authenticated, `409` duplicate email/username, `500` server error).

### Products -- `/api/products`

| Method | Path                | Auth required | Description |
|--------|---------------------|:--------------:|--------------|
| GET    | `/api/products`     | No | List products. Optional query params: `search` (matches name/description, case-insensitive) and `category` (exact match: `Electronics`, `Clothing`, `Home`, `Books`, `Sports`, `Toys`). Returns `{ count, products }`. |
| GET    | `/api/products/:id` | No | Get a single product by its MongoDB `_id`. Returns `{ product }`. `404` if not found, `400` if the ID is not a valid ObjectId. |

---

## 4. Notes on the seed data

- Descriptions in `backend/seed/seedProducts.js` are **pre-written by hand**
  in a marketing-copy style (2-3 sentences each) so the seed script runs
  instantly and offline, with no API keys or external AI calls required.
- Images use [picsum.photos](https://picsum.photos) placeholder URLs with
  unique seeds per product (e.g. `https://picsum.photos/seed/headphones1/400/300`),
  so each product gets a distinct, consistent image without hosting any
  image files yourself.
- Re-running `npm run seed` deletes all existing products and reinserts the
  full sample set -- it does not touch user accounts.

---

## 5. Security notes (read before any real deployment)

This project intentionally relaxes some security practices to make local
testing over plain HTTP simple. Before using anything like this beyond a
learning exercise:

- Set a long, random `JWT_SECRET` and keep `.env` out of version control.
- Switch the auth cookie to `secure: true` once you have HTTPS configured,
  so it is never sent over an unencrypted connection.
- Add rate limiting (e.g. `express-rate-limit`) to the auth routes to slow
  down brute-force login/registration attempts.
- Add server-side input validation/sanitization beyond the basic checks
  here if accepting more complex user input.
- Keep Node.js, MongoDB, and all npm dependencies patched and up to date.

---

## License

MIT -- for educational use.
