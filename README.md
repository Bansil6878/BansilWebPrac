# Getting Started

## Install Dependencies

```bash
npm install
```

## Start Metro Server

```bash
npm start
```

## Run Android Application

```bash
npm run android
```

# Project Description

This application is built using React Native and TypeScript. It displays Characters, Episodes, Locations, and Favourite Characters using the Rick and Morty API. The application uses React Query for API handling, Redux Toolkit for state management, and SQLite for offline favourite storage.

# Notes

* If multiple API requests are triggered in a short period, the API provider or Cloudflare may temporarily return rate limit errors (Too Many Requests). In such cases, please wait a few seconds and retry the request.