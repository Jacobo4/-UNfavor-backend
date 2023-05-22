# UN Favor

## Description

Backend for the consumption of web services of the CIGNUS platform.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

## Installation
### Requirements

- NodeJS v18

### Steps

#### 1. Install dependencies

```
  npm install
```

#### 2. Create .env

1. Import `.env` file in root to manage environmental variables
```
    MONGO_USERNAME = "USERNAME"
    MONGO_PASSWORD = "PASSWORD"
    JWT_ACCESS_EXPIRATION = "TIME"
```

## Usage

### Change port

1. Change `PORT` if necessary in .env

```
    SERVER_PORT = 3000
```

### Run project

```
  npm start
```