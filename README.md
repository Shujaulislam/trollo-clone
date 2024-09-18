# TaskTracker

TaskTracker is a project management application built with Next.js that allows users to create projects, manage tasks, and collaborate with team members.

## Features

- User authentication (register, login, logout)
- Create and manage projects
- Add, edit, and delete tasks
- Assign tasks to users
- Set due dates and tags for tasks

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/tasktracker.git
   ```

2. Navigate to the project directory:
   ```
   cd tasktracker
   ```

3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

4. Run the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Registration

1. Click on the "Register" button on the landing page.
2. Fill in your name, email, and password.
3. Click "Register" to create your account.

### Login

1. Click on the "Login" button on the landing page.
2. Enter your email and password.
3. Click "Login" to access your dashboard.

### Logout

1. Click on the "Logout" button in the top-right corner of the dashboard.

### Creating a Project

1. On the dashboard, click the "New Project" button.
2. Enter the project name and description.
3. Click "Save" to create the project.

### Adding Tasks

1. Open a project by clicking on it from the Projects tab.
2. Click the "New Task" button.
3. Fill in the task details (name, description, status, tags, due date, assigned user).
4. Click "Save" to add the task to the project.

### Editing Tasks

1. Click the edit icon (pencil) on a task card.
2. Update the task details in the modal.
3. Click "Update" to save the changes.

### Removing Tasks

1. Click the delete icon (trash can) on a task card.
2. Confirm the deletion when prompted.

### Using the Task Board

1. Click on the "Task Board" tab in the dashboard.
2. Update the tasks between different status columns.
3. Add new status columns by entering a name and clicking "Add another list".

 ## Note:-

 This project uses local storage to store the tasks, users and projects. some functionalities might not work as expected because of this if you face any issues please clear the local storage or drop a message on my email.


## License

This project is licensed under the MIT License.
