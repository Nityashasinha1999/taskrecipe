Task Manager
A lightweight task management app with recipe collection features.
Features

Task Management with Drag and Drop: Easily manage tasks with an intuitive drag-and-drop interface.
Recipe Browsing: Explore recipes fetched from TheMealDB API.
Dark Theme: Enjoy a sleek, consistent dark theme across the app.

Setup

Install dependencies:npm install


Run the development server:npm run dev


Open http://localhost:3000 in your browser.

Project Structure
src/
├── app/          # Pages
├── components/   # React components
├── store/        # State management
└── providers/    # React providers

Features in Detail
Task Board

Drag and Drop: Move tasks between statuses (To Do, In Progress, Done).
Filtering: Filter tasks by status or priority (High, Medium, Low).
Search: Search tasks by title or description in real-time.
Sorting: Sort tasks by title, priority, or due date.
Responsive Design: Works seamlessly on desktop and mobile.

Recipe Collection

API Integration: Pulls recipes from TheMealDB API.
Search: Find recipes by name.
Detailed View: View ingredients and instructions for each recipe.
Responsive Layout: Adapts to various screen sizes.
Dark Theme: Matches the app’s dark theme for a unified look.

License
This project is licensed under the MIT License - see the LICENSE file for details.
