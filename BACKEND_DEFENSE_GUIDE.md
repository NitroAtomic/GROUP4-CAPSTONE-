# SE-AWARE Backend Defense Guide

**Web-Based Social Engineering Awareness Platform for Remote Workers**
Group 4 · MO-IT200D2 · Capstone 2 · BSIT A4102

**Backend and authentication:** Juan Paolo Dente
**Database schema:** Jyan Estanislao

Checked against the code on **October 23, 2026**. Everything here describes the system as it runs now, at https://se-aware-group.onrender.com. If you change the code, update this guide too, so nobody defends something that is no longer true.

How to use this guide: read sections 1 to 6 once to understand the system. Section 12 is the question bank. Practice saying the answers in your own words. Do not memorize them line by line.

---

## 1. The system in one minute

SE-AWARE teaches remote workers, freelancers and virtual assistants to recognize social engineering: phishing, smishing, vishing, pretexting and the scams that target client work.

| Part | What it does |
|---|---|
| Free tier | 6 foundational modules with quizzes, open to everyone. The chatbot is open to everyone too. |
| Premium tier | 4 role-based courses, a personal dashboard with recommendations, and the awareness assessment. |
| Payment | PayMongo checkout in test mode. Card and GCash. ₱149 a month or ₱1,199 a year. |
| Security | Email OTP for Premium logins, bcrypt hashing, rate limits, server-side access checks. |
| Admin portal | Manage modules and quiz questions, view payments and subscription changes. |

The backend is a Node.js + Express API with a MySQL database. One Render service runs the API and also serves the built Vue frontend.

---

## 2. Technology stack, and why

| Choice | Why we chose it |
|---|---|
| **JavaScript everywhere** | Vue in the browser and Node.js on the server use the same language, so the whole team can read and review all the code. |
| **Node.js + Express 5** | Fast for many small API requests. Express keeps routes and middleware easy to point at, which matters when you have to explain who can access what. |
| **MySQL** | The data is relational: a user has many quiz results, a module has one quiz. Foreign keys keep it consistent. It is also what Jyan designed the schema in. |
| **Vue 3 + Vite + Tailwind** | Frontend. Vite builds it into static files that Express serves. |
| **Render** | Hosts the app from our GitHub repo. Free tier, so it sleeps after about 15 minutes idle. |
| **Aiven** | Hosts the MySQL database. The connection uses TLS. |
| **PayMongo** | Philippine payment gateway that supports card and GCash, with a full test mode. |
| **Google Gemini** | Powers the CyberWise chatbot. |

---

## 3. Backend libraries

| Library | What it does in our system |
|---|---|
| `express` | Web server and API routes |
| `mysql2` | Talks to MySQL. Every query uses `?` placeholders, so user input is never pasted into SQL. |
| `bcrypt` | Hashes passwords and the one-time codes (cost factor 10) |
| `jsonwebtoken` | Creates and checks login tokens (JWT), valid for 7 days |
| `helmet` | Adds security headers to every response |
| `cors` | Only lets our own site call the API |
| `express-rate-limit` | Blocks too many attempts in a short time |
| `nodemailer` | Sends the OTP and password reset emails |
| `compression` | Makes responses smaller and faster |
| `dotenv` | Reads secrets (database password, JWT secret, API keys) from `.env`, which is never committed |

`multer` is installed but not used yet. Built-in Node modules we use: `crypto` (secure random codes), `fs` and `path` (serving the frontend and the premium lessons).

---

## 4. How the backend is organized

```
backend-node/
  server.js        starts Express, adds helmet, CORS, rate limits, routes, serves the frontend
  routes/          one file per area: auth, modules, quizzes, assessments, dashboard, billing, chat
  middleware/      auth.js (logged in? admin?), premium.js (Premium?), rateLimit.js
  services/        payments.js (settling a PayMongo payment)
  config/          db.js (MySQL pool + TLS), email.js, env.js
  content/premium/ the 4 premium lessons, only sent after the Premium check
  sql/             numbered migration files, run in order
  scripts/         helper commands (migrations, make admin, show payments, chatbot knowledge base)
```

One rule runs through all of it: **the server decides access, not the page.** Hiding a button only stops people who don't look. Every protected route checks on the server.

The Premium check lives in one place, `middleware/premium.js`. A person is Premium when the account type is Premium, the status is `active` or `cancelled`, and the end date has not passed. Admins pass automatically.

---

## 5. The main flows, explained simply

### Login with email OTP (Premium accounts)

1. The user enters email and password. The password is checked against the bcrypt hash.
2. If the account is Premium, the server does not log them in yet. It emails a 6-digit code and gives the browser a short "pending" token.
3. The user types the code. The server checks it: not expired (5 minutes), not used, fewer than 5 wrong tries, and the bcrypt hash matches.
4. Only then does the server give the real login token.

Extra protection:
- The pending token is rejected by every other route, so nobody can skip the code step. This was a real hole we found and closed.
- Asking for a new code cancels the old one.
- On top of the 5 tries per code, the server allows 10 verify attempts per 15 minutes from the same network.
- The code comes from `crypto.randomInt`, which is secure random, not `Math.random`.

Free accounts log in with just the password, on purpose. They have no payment details and no paid content.

### Paying for Premium

1. The user picks monthly or yearly. The server creates a `payment_transaction` row with status `pending` and a reference number, then asks PayMongo for a checkout page.
2. The user pays on PayMongo's page (test mode: test cards and test GCash only).
3. PayMongo sends them back to `/payment/confirm`. Our server then asks PayMongo directly whether that checkout was paid. It never trusts what the browser says.
4. Premium is granted only if PayMongo says paid **and** the amount matches what we charged. The days are added from the later of today or the current end date, so renewing early never loses days.
5. If the user closed the tab before coming back, the server checks again the next time their account loads (for checkouts from the last two days) and settles it then.

Asking for Premium directly (`PATCH /api/auth/me/subscription` with Premium) is refused with 403. Before we fixed it, anyone could do that from the browser console.

### Cancelling (like Netflix or Spotify)

- Cancel sets the status to `cancelled`. The account stays Premium until the paid end date, then becomes Free.
- **Keep Premium** undoes the cancel before the date, with no new payment.
- Old demo accounts that have no end date go Free right away, because there is no paid period to keep.
- Every cancel and every Keep Premium is recorded in `subscription_event`, and admins see it under Payments, Subscription changes.
- Cancelling does not refund. There is also no automatic charge to stop: each payment covers one month or one year.

### When Premium ends

- The server checks the end date on every request, so access stops on time even if the user is still logged in.
- The next time the account loads, or at login, it is switched to Free. The end date is kept as a record.
- In the browser, a popup says "Your Premium has ended" and takes the user back to the free home page, with a Renew Premium button. They are not logged out, because only the plan changed.
- Progress and quiz scores are kept.

### Protecting paid content

The 4 premium lessons are **not** inside the public JavaScript. They live on the server in `content/premium/` and are sent by `GET /api/modules/:slug/content` only after the Premium check. A logged-out visitor or a Free account gets 403.

### The admin portal

- Admin routes check `role = 'admin'` on the server.
- Modules tab: create, edit and delete modules, manage quiz questions. A module with learner progress or quiz history cannot be deleted.
- Payments tab: summary figures, every checkout, and the subscription changes list.
- An admin can close an unfinished checkout as cancelled, and delete test records. The SQL itself refuses to delete anything paid or live: `WHERE livemode = 0 AND status <> 'paid'`.
- There is no button to become admin. Promotion needs direct database access (`npm run user:admin -- email@example.com`).

---

## 6. Security decisions worth defending

- **Passwords are bcrypt-hashed.** Even with full database access, nobody can read them.
- **SQL injection:** every query uses placeholders.
- **Brute force:** rate limits per network (per 15 minutes): login, register, forgot and reset password 20; OTP verify and resend 10; checkout 20; chatbot 60; everything else 300.
- **Premium content, admin routes and payments are all checked on the server.**
- **Helmet** security headers, and **CORS** only allows our site.
- **Forgot password** gives the same reply whether or not the email exists, so nobody can test which emails have accounts.
- **Sessions use `sessionStorage`**, so they end when the tab closes. Good for remote workers on shared computers.
- **Secrets stay in `.env`**, which is in `.gitignore`. Anyone with the JWT secret could fake a login for any account.
- **Chatbot replies are escaped** before they are shown, so a reply cannot run scripts in the page.
- **Payments stay in test mode** (`sk_test_` keys) during school use. Every record stores `livemode`, and the admin page shows a red LIVE warning if a real payment ever appears.

---

## 7. Database

### Migration files, run in order

| File | Purpose |
|---|---|
| `01-jyan-base-schema.sql` | Jyan's schema, unmodified. The ERD entities: `user`, `module`, `quiz`, `quizresult`, `awarenessassessment`, `progress`, `administrator`. |
| `02-backend-additions.sql` | Columns and tables features need. Kept separate so Jyan's original stays reviewable. |
| `03-seed.sql` | The 10 modules (6 free, 4 premium) and their quiz rows. |
| `04-quizquestion-enhancements.sql` | Extra columns for quiz questions. |
| `05-import-quizquestions.sql` | The quiz question bank. |
| `06-payment.sql` | `payment_transaction` table and `user.subscription_expires_at`. |
| `07-subscription-events.sql` | `subscription_event` table: every cancel and Keep Premium. |

Run one with `npm run db:migrate -- sql/<file>.sql`, or open it in MySQL Workbench and press the lightning bolt.

### What `02-backend-additions.sql` adds, and why

| Addition | Needed for |
|---|---|
| `user.role` | Checking admin access |
| `quizresult.total` | The dashboard average. `score` alone can't tell 8/10 from 8/20. |
| `awarenessassessment.weak_areas`, `.by_topic`, `.total` | Recommendations and the weak areas count |
| `module.slug` | Linking a page to its row without depending on a title an admin can rename |
| `quizquestion` table | Quiz questions in the database, so admins can edit them |
| `otpcode` table | Login codes and password reset codes |
| `progress` unique key | No duplicate rows when a module is completed twice |

### On the `administrator` table

Jyan's schema has a separate `administrator` table, matching the ERD, and it was left in place. The backend checks `user.role = 'admin'` instead. An admin still needs to log in, and login already works for every account through `user`. A second table with its own passwords would mean two login systems to secure. One system with a role is less code and less risk.

---

## 8. Commands used in MySQL Workbench

### Proving passwords are hashed (the best query to show a panel)

```sql
SELECT user_id, first_name, email, subscription_type, role, password_hash
FROM user;
```

`password_hash` looks like `$2b$10$Tzae4t4Qvql...`, not the real password. `$2b$` means bcrypt, `10` is the cost factor.

### Checking someone's plan

```sql
SELECT email, subscription_type, subscription_status, subscription_expires_at
FROM user
WHERE email = 'your@email.com';
```

### Payments and subscription changes

```sql
-- Every checkout, newest first
SELECT reference_number, billing_period, amount_centavos, status, livemode, created_at, paid_at
FROM payment_transaction ORDER BY created_at DESC;

-- Every cancel and Keep Premium
SELECT e.created_at, u.email, e.event_type, e.access_until
FROM subscription_event e JOIN user u ON u.user_id = e.user_id
ORDER BY e.created_at DESC;
```

### Making an account admin

```sql
UPDATE user SET role = 'admin' WHERE email = 'your@email.com';
```

Or from the terminal: `npm run user:admin -- your@email.com`. With no email, it lists the current admins.

### OTP codes (they are hashed too)

```sql
SELECT otp_id, user_id, purpose, expires_at, used, attempts
FROM otpcode ORDER BY otp_id DESC;
```

---

## 9. Running the system

### On your computer

```
npm install            (also installs the backend)
cd backend-node
npm start              (API on port 3000)
```

In a second terminal, from the project folder: `npm run dev` (frontend on port 5173).

Health check: `http://localhost:3000/api/health` returns `{"status":"ok","database":"connected"}`.

### Other commands

| Command | What it does |
|---|---|
| `npm run db:migrate -- sql/<file>.sql` | Apply a SQL file to the database |
| `npm run user:admin -- email` | Make an account admin |
| `npm run db:payments` | Print the payment records |
| `npm run kb:build` | Rebuild the chatbot's knowledge base from the free modules |
| `npm run preview:premium` | View the premium lessons without a server or a login (project folder) |

### Before a demo

Render's free tier sleeps. Open the live site about 15 minutes early. The first request after sleeping takes 30 to 60 seconds.

---

## 10. API endpoints

All under `/api`, JSON in and out.

### Accounts (`/api/auth`)

| Method | Endpoint | Who | Purpose |
|---|---|---|---|
| POST | `/register` | anyone | Create an account |
| POST | `/login` | anyone | Log in. Premium gets `requiresOtp` instead of a token. |
| POST | `/verify-otp` | pending token | Check the emailed code, get the real token |
| POST | `/resend-otp` | pending token | Send a new code |
| POST | `/logout` | logged in | End the session |
| GET | `/me` | logged in | Current account and plan |
| PATCH | `/me/subscription` | logged in | Cancel only. Asking for Premium is refused (403). |
| POST | `/me/subscription/resume` | logged in | Keep Premium (undo a cancel) |
| POST | `/forgot-password` | anyone | Request a reset code |
| POST | `/reset-password` | anyone | Code + new password |

### Learning content

| Method | Endpoint | Who | Purpose |
|---|---|---|---|
| GET | `/modules` | anyone | Modules this person may see |
| GET | `/modules/premium-list` | anyone | Public list of premium course titles |
| GET | `/modules/:slug` | anyone | One module, 403 if Premium and not allowed |
| GET | `/modules/:slug/content` | Premium | A premium lesson's content |
| GET | `/modules/:slug/quiz` | depends on module | That module's quiz |
| POST, PUT, DELETE | `/modules` | admin | Manage modules |
| GET | `/quizzes/by-module/:slug` | depends on module | Quiz questions without the answer key |
| POST | `/quizzes/record-attempt` | logged in | Save a quiz score (checked: whole numbers, 0 to total) |
| POST | `/quizzes/:quizId/submit` | logged in | Server-side scoring (built, not used by the quiz page yet) |
| GET, POST, PUT, DELETE | `/quizzes/.../questions` | admin | Manage quiz questions |
| GET | `/dashboard` | logged in | Progress, quiz history, latest assessment |
| GET | `/dashboard/recommendations` | logged in | Modules for the weak areas |
| POST | `/assessment/submit` | Premium | Save an assessment result |
| GET | `/assessment/latest` | Premium | Latest assessment result |
| POST | `/chat` | anyone | Ask the CyberWise chatbot |

### Payments (`/api/billing`)

| Method | Endpoint | Who | Purpose |
|---|---|---|---|
| GET | `/plans` | anyone | Prices and payment methods |
| POST | `/checkout` | logged in | Start a PayMongo checkout |
| POST | `/confirm` | logged in | Ask PayMongo if it was paid, grant Premium if so |
| GET | `/transactions` | logged in | My own payments |
| GET | `/transactions/all` | admin | All payments + subscription changes |
| PATCH | `/transactions/:reference/cancel` | admin | Close an unfinished checkout |
| DELETE | `/transactions/:reference` | admin | Delete a test record (never paid or live) |

---

## 11. Honest limits and future work

Say these plainly if asked. Knowing your limits is a strength in a defense.

| Limit | Why it is like this | Next step |
|---|---|---|
| Email OTP, not an authenticator app | Free, and every user already has email | Authenticator app (TOTP) |
| Quiz answers are checked in the browser | It is a practice quiz with instant feedback, not a graded exam | Switch the quiz page to the server scoring route that already exists |
| Assessment is scored in the browser, then saved | Same reason; only Premium accounts can save one | Score it on the server |
| No automatic renewal | Each PayMongo checkout is a one-time payment | Recurring billing |
| JWT lasts 7 days and can't be revoked early | Normal for token logins | Shorter tokens with refresh tokens |
| Email address not verified at sign-up | Kept sign-up simple | Verification email |
| Free hosting sleeps | No budget | Paid instance for real use |
| Test mode payments only | School project, no real money | Live keys after a security review |

---

## 12. Question bank

### About the project

**What does your system do?**
It teaches remote workers, freelancers and VAs to spot social engineering. Six free modules cover the basics. Premium adds four role-based courses for client work, a personal dashboard and an awareness assessment.

**Who are your users, and why them?**
Remote workers, freelancers and virtual assistants. They get targeted by phishing and impersonation, but most never get the security training office employees get.

**What is the difference between Free and Premium?**
Free gives the six foundational modules, their quizzes and the chatbot. Premium adds the four role-based courses (Client Impersonation, Invoice and Payment Scams, Fake Job and Recruiter Offers, Secure Client Data Handling), the personal dashboard with recommendations, and the awareness assessment.

**What was your role?**
Backend and authentication: the API, the database connection, login and OTP, payments, cancel and expiry, access control and the admin backend.

### Technology

**Why Node.js?**
Same language as the frontend, so the whole team can read all the code. It handles many small API requests well, and npm has packages for everything we needed: hashing, tokens, rate limits, email.

**Why MySQL and not a NoSQL database?**
Our data is relational: users have progress, quiz results and payments; modules have quizzes. Foreign keys keep that consistent, and the schema follows our ERD directly.

**What libraries did you use?**
express for the server, mysql2 for the database, bcrypt for hashing, jsonwebtoken for login tokens, helmet and cors for security headers and origins, express-rate-limit against brute force, nodemailer for the emails.

**How does the frontend talk to the backend?**
A REST API. The Vue app sends JSON requests to `/api/...` and gets JSON back. The login token goes in the Authorization header.

**Where is it hosted?**
Render hosts the app, built from our GitHub repo. Aiven hosts the MySQL database, connected over TLS.

### Login and OTP

**How does your MFA work?**
Premium accounts get a 6-digit code by email after the correct password. It expires in 5 minutes, works once, and locks after 5 wrong tries. We store it hashed with bcrypt.

**Why email OTP and not SMS?**
Three reasons. Cost: SMS gateways charge per message, email is free. Our users already work with email open on the same laptop. And SMS is not safer: SIM swapping and fake texts are exactly what our Smishing module teaches people to watch for. The weakness is that email OTP is only as safe as the email account; an authenticator app would be the next step.

**Why only Premium gets OTP?**
Free accounts have no payment details and no paid content, so there is very little to steal. An extra step on every login would push away the learners we want. Premium accounts hold payment history and paid access.

**Can someone guess the code?**
They get 5 tries per code, 10 attempts per 15 minutes from one network, and the code changes every 5 minutes. That is about 10 guesses out of a million possible codes.

**Can someone skip the OTP page?**
No. After the password, the server only gives a pending token, and every other route rejects it until the code is verified.

**What if the email doesn't arrive?**
There's a Resend button. It sends a new code and cancels the old one.

### Passwords and sessions

**How are passwords stored?**
Hashed with bcrypt, cost factor 10. I can show it in Workbench: the column holds a hash starting with `$2b$10$`, not the password.

**Why bcrypt and not SHA-256?**
bcrypt is slow on purpose and adds a random salt to each password. That makes guessing billions of passwords offline impractical. SHA-256 is built to be fast, which helps attackers.

**What if someone steals a login token?**
They could act as that user until it expires, which is true of any token login. We reduce the risk: the token lives in sessionStorage and disappears when the tab closes, and it expires after 7 days. Shorter tokens with refresh tokens would be the next step.

**What happens on forgot password?**
The user gets a 6-digit code by email, same rules as the login code. The reply is the same whether or not the email exists, so nobody can use it to find out who has an account.

### Payment

**Is the payment real?**
It is a real PayMongo integration in test mode, as the adviser asked. Test cards and test GCash work exactly like real ones, but no money moves.

**How do you make sure nobody gets Premium without paying?**
Premium is granted only after our server asks PayMongo directly and PayMongo says the checkout was paid, for the right amount. The old route that let the browser ask for Premium now returns 403.

**What if the user closes the tab after paying?**
The payment is still recorded as pending. The next time their account loads, within two days, the server checks with PayMongo and grants Premium if it was paid.

**What if they pay twice or renew early?**
New days are added from the later of today or the current end date, so no days are lost. The same payment can't be counted twice; the update only runs while the payment is still pending.

**How would you switch to real payments?**
Swap the test keys for live keys in Render's settings. We would do a security review first.

### Subscription

**What happens when a user cancels?**
Like Netflix: they keep Premium until the end date they paid for, then the account becomes Free. They can press Keep Premium to undo it before the date.

**Do they get a refund?**
No, cancelling does not refund. It only stops them from continuing after the paid period.

**What happens when Premium ends?**
The server checks the date on every request, so access stops on time. The user sees a "Your Premium has ended" popup and goes back to the free home page. Their progress and scores are kept, and they can renew any time.

**Is there auto-renewal?**
No. Each payment is a one-time checkout for a month or a year. Recurring billing is future work.

### Access control and admin

**Can a Free user open premium content by editing the page?**
No. The lessons are not in the page at all. They come from the server only after the Premium check. A Free account calling the API directly gets 403.

**How does the admin portal stay secure?**
Every admin route checks the role on the server. There's no button or API to become admin; it takes direct database access.

**Why no separate administrator table like the ERD?**
The table is still there. We check a role on the user record instead, because admins log in like everyone else. Two login systems would be twice the risk.

**Can an admin delete payment records?**
Only unpaid test records. The rule is written in the SQL itself, so even a bug in the page can't delete a paid or live payment.

### Security

**Is your system safe from SQL injection?**
Yes. Every query uses placeholders, so input is sent as data and never becomes part of the SQL command.

**What about brute force attacks?**
Rate limits per network: 20 login attempts per 15 minutes, 10 OTP attempts, and limits on checkout, the chatbot and the API in general.

**What about XSS?**
The chatbot's replies are escaped before they are shown, and helmet adds security headers.

**Where are your secrets kept?**
In environment variables: `.env` locally, Render's settings online. `.env` is never committed to GitHub.

### Quizzes and assessment

**How is the awareness level computed?**
10 scenario questions per attempt, shuffled. 80 percent and up is Advanced, 60 to 79 is Intermediate, below 60 is Beginner. Topics with wrong answers become weak areas, and each one recommends a module.

**Can a user cheat the quiz?**
Be honest: the quiz checks answers in the browser, because it's a practice quiz with instant feedback, not a graded exam. The server still validates the score it saves: whole numbers, between 0 and the total. A server scoring route already exists for the next version.

### Chatbot

**How does the chatbot work?**
CyberWise uses Google Gemini. It answers from a knowledge base built from our six free modules, rebuilt with `npm run kb:build`. It is rate limited to 60 messages per 15 minutes per network.

**What if Gemini is down?**
The chat shows a plain "could not reach the assistant" message instead of breaking the page.

### Testing

**How did you test the backend?**
Against a real MySQL database: cancel and Keep Premium, the subscription history, login for expired accounts, and the payment guards. We also checked the live site after every deploy.

**What bugs did you find?**
Three good examples: anyone could make themselves Premium from the browser console, the OTP step could be skipped with the pending token, and cancelling ended Premium immediately instead of at the end date. All three are fixed and tested.

### The hardest part

**What was the hardest part?**
Turning the ERD into access rules that can't be bypassed. Drawing that a user has many records is easy. Making sure a user only ever sees their own rows, an admin sees all of them, and none of it can be skipped from the browser meant asking, for every route, what the worst thing someone could try is.
