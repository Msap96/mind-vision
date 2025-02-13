# MindVision - Visualization Training App

A modern web application built with Next.js, TypeScript, and Tailwind CSS to help users enhance their mental visualization and imagery skills through guided exercises.

## Features

- 🧠 Progressive visualization exercises
- ⏱️ Customizable exercise durations
- 📝 Reflection journal for tracking progress
- 🎨 Beautiful, responsive UI with smooth animations
- 🌙 Light/dark mode support
- 💾 MySQL database for persistent storage

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Lucide Icons](https://lucide.dev/) - Icons
- [Prisma](https://www.prisma.io/) - Database ORM
- [MySQL](https://www.mysql.com/) - Database

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- MySQL Server
- MySQL Workbench (recommended for database management)

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/mind-vision.git
cd mind-vision
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your MySQL credentials
# Replace USER and PASSWORD with your actual MySQL credentials
```

4. Set up the database:

```bash
# Create the database
mysql -u root -p
CREATE DATABASE mindvision;

# Push the database schema
npx prisma generate
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

1. Install MySQL:

   - Download MySQL Server: https://dev.mysql.com/downloads/mysql/
   - Download MySQL Workbench: https://dev.mysql.com/downloads/workbench/

2. Create a new connection in MySQL Workbench:

   - Connection Name: MindVision Local
   - Hostname: localhost
   - Port: 3306
   - Username: your_username
   - Password: your_password

3. Create the database:

   ```sql
   CREATE DATABASE mindvision;
   ```

4. Update your `.env` file with your MySQL credentials.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio to manage database

## Database Management

- Use Prisma Studio to manage your data:
  ```bash
  npx prisma studio
  ```
- Use MySQL Workbench for direct database access
- Monitor your database with:
  ```bash
  npx prisma format
  npx prisma validate
  ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
