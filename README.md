# fQuiz

## Project Overview

fQuiz is a web application that allows users to create, manage, and take quizzes. The application supports multiple quiz formats, including standard multiple-choice quizzes and flashcards. Users can create quizzes, save them, and track their performance over time.

## Features

- Create and manage quizzes with multiple question types
- Save quizzes and track performance statistics
- Dark mode support
- Responsive design for mobile and desktop

## Setup Instructions

### Prerequisites

- Node.js (version 20 or higher)
- npm (version 6 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/fquiz.git
   cd fquiz
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Running the Application

To start the development server, run:

```bash
npm run dev
```

This will start the Vite development server and open the application in your default web browser.

### Building for Production

To build the application for production, run:

```bash
npm run build
```

This will create a `dist` directory with the production build of the application.

### Previewing the Production Build

To preview the production build locally, run:

```bash
npm run preview
```

## Contributing

We welcome contributions from the community! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to contribute to the project.

## Troubleshooting

### Common Issues

#### Issue: Application not starting

- **Solution:** Ensure that you have the correct versions of Node.js and npm installed. Run `node -v` and `npm -v` to check your versions.

#### Issue: Build errors

- **Solution:** Make sure all dependencies are installed correctly by running `npm install`. If the issue persists, try deleting the `node_modules` directory and running `npm install` again.

#### Issue: Dark mode not working

- **Solution:** Ensure that your browser supports dark mode and that you have enabled it in the application settings.

If you encounter any other issues, please open an issue on our [GitHub repository](https://github.com/yourusername/fquiz/issues).

## Tutorial: Creating Quizzes

### Creating a Standard Multiple-Choice Quiz

1. Navigate to the "Create Quiz" section.
2. Select "Standard" as the quiz format.
3. Choose "Multiple Choice" as the quiz type.
4. Enter your questions and options in the provided fields.
5. Click "Generate Quiz" to create the quiz.

### Creating a True/False Quiz

1. Navigate to the "Create Quiz" section.
2. Select "Standard" as the quiz format.
3. Choose "True/False" as the quiz type.
4. Enter your questions in the provided field.
5. Click "Generate Quiz" to create the quiz.

### Creating a Flashcard Quiz

1. Navigate to the "Create Quiz" section.
2. Select "Flashcards" as the quiz format.
3. Enter your flashcards in the provided field, with each question and answer separated by a tab.
4. Click "Generate Quiz" to create the quiz.
