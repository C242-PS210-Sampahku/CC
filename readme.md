# Express.js server with Prisma Application

This is an Express.js application that uses Prisma as the ORM (Object Relational Mapper) to interact with a my sql database.
Use firebase auth and cloud storage for store image. 

---

## Prerequisites

Make sure you have the following installed on your system:

1. **Node.js**: Version 20.x or later. Download it from [Node.js official website](https://nodejs.org/).
2. **Prisma CLI**: Installed as a dev dependency in the project.
3. **Database**: A supported database (e.g., PostgreSQL, MySQL, SQLite, etc.).
4. **npm or yarn**: For managing dependencies.

---

## Getting Started

### 1. Clone the Repository

    git clone https://github.com/C242-PS210-Sampahku/CC-main-api.git
    cd CC-main-api

### 2. Install Depedency

    npm install
    # or if you use Yarn
    yarn install
### 3. Configure the env 
take a look in .env.example, 
fill like service account, url database and etc

### 4. Migrate the database

    npx prisma migrate dev

### 5. Start the Development Server
   Run the following command to start the server in development mode:


    npm run dev


### 6. Start the Production Server
   To run the application in production mode:

    npm start
