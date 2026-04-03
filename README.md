# BCIA - Container Inspection App

BCIA is a mobile app for container inspection. Inspectors can create inspections, add damages, upload photos, and complete inspection workflows through a React Native app connected to a NestJS API.

## Project Structure

- `frontend`: React Native mobile app (Android/iOS)
- `backend`: NestJS API + Prisma + PostgreSQL + Cloudinary integration
- `MANUAL_TEST_PLAN.md`: manual QA checklist

## Tech Stack

### Frontend
- React Native
- TypeScript
- React Navigation
- React Hook Form
- Zustand
- Axios
- react-native-image-picker

### Backend
- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Cloudinary
- Multer

## Environment Requirements

The frontend and backend currently use different Node versions:
- backend: `22.22.0` (see `backend/.node-version`)
- frontend: `16` (see `frontend/.node-version`)

Recommended tools:
- Yarn
- PostgreSQL
- Android Studio (for Android)
- Xcode (for iOS)

## Run Locally

### Backend

```bash
cd backend
yarn install
copy .env.example .env
```

Update `backend/.env`:

```env
JWT_SECRET=replace-with-a-strong-secret
JWT_EXPIRES_IN=1d
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/container_inspect

# Optional Cloudinary
# CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
```

Run migrations:

```bash
yarn prisma migrate deploy
```

Optional seed data:

```bash
psql "$DATABASE_URL" -f prisma/reset-and-seed.sql
```

Start backend:

```bash
yarn start:dev
```

Default API URL: `http://localhost:3000`

### Frontend

```bash
cd frontend
yarn install
```

Update API target in `frontend/src/api/apiInstance.ts` for local backend:
- set `USE_LOCAL_API_IN_DEV = true`
- keep `LOCAL_API_BASE_URL = http://10.0.2.2:3000` for Android emulator
- rewrite `LOCAL_API_BASE_URL = [Your Public IP in Railway]` for Android emulator

Start Metro:

```bash
yarn start
```

## Quick Test Account

If you seeded via `backend/prisma/reset-and-seed.sql`, you can use:
- username: `surveyora`
- password: `Password123!`

Or register a new account in the app.

## Deploy Backend to Railway

Note: Railway is used for backend/API only. The React Native app is distributed as mobile builds (APK/IPA), not as a Railway web service.

### Service Setup

1. Create a new Railway project and connect your GitHub repository.
2. Create a service from this repo.
3. Set **Root Directory** to: `backend`
4. Set **Region** to: `Singapore`
5. In networking, choose **Public IP**.

### Build and Start Commands

Use exactly these commands:

Build command:

```bash
yarn install --frozen-lockfile --production=false;npx prisma generate;yarn build;npx prisma migrate deploy
```

Start command:

```bash
yarn start:prod
```

### Required Railway Variables

Set these service variables:
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN` (optional, e.g. `1d`)
- `CLOUDINARY_URL` (recommended)

Variables you may also see/set in Railway:
- `NODE_ENV` = production
- `YARN_PRODUCTION` = false

### Point Mobile App to Railway API

Update `frontend/src/api/apiInstance.ts`:
- set `PROD_API_BASE_URL` to your Railway backend URL
- keep `USE_LOCAL_API_IN_DEV = false` if you want dev builds to hit Railway

## Android Release Notes

In `frontend/android/app/build.gradle`, release is currently signed with debug keystore.

Before publishing to Play Store:
- create your own upload keystore
- update `release` signing config to use that keystore
- increment `versionCode` and `versionName` every release

## Quick Commands

Backend:
```bash
cd backend
yarn install
yarn prisma migrate deploy
yarn start:dev
```

Frontend:

```bash
cd frontend
yarn install
yarn start

```