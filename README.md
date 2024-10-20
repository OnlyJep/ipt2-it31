# Project Setup Instructions
Follow these steps to set up the project on your local environment using VS Code.
## 1. Clone the Repository

a. Open your terminal in VS Code.
b.  Run the following commands to initialize the git repository and pull the project files:

```markdown
git init
git remote add origin <link>
git fetch --all
git pull <branch_name>
```

Replace `<link>` with your repository URL, and `<branch_name>` with the branch you want to pull.

## 2. Install Laravel Dependencies

Once the Laravel files are available in your folder, install the necessary dependencies:

```bash
composer require laravel/passport
composer require laravel/ui
php artisan ui react
npm install
npm i react-router-dom
copy .env.example .env
php artisan key:generate
```

## 3. Run the Application

### Terminal 1: Start Laravel Backend

Run this command to start the Laravel server:

```bash
php artisan serve
```

### Terminal 2: Start React Frontend

In a new terminal, run the following to start the React frontend:

```bash
npm run watch
```

You're all set! The application should now be running on your local environment.