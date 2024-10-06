import { SunIcon, MoonIcon, Bars3Icon } from '@heroicons/react/24/solid';

const Header = ({ darkMode, toggleDarkMode, setCurrentView }) => {
    return (
        <div className="flex justify-between items-center mb-6">
            {/* Title */}
            <h1 className="text-center text-4xl font-bold text-blue-600 dark:text-blue-400">fQuiz</h1>

            {/* Buttons for large screens */}
            <div className="hidden sm:flex items-center">
                <button
                    onClick={toggleDarkMode}
                    className="px-4 py-2 bg-blue-600 text-white rounded flex items-center space-x-2 cursor-pointer transition-transform transform hover:scale-105"
                >
                    {darkMode ? (
                        <MoonIcon className="h-6 w-6" />
                    ) : (
                        <SunIcon className="h-6 w-6" />
                    )}
                    <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
                </button>

                <button
                    onClick={() => setCurrentView('manage')}
                    className="ml-4 px-4 py-2 bg-green-600 text-white rounded flex items-center space-x-2 cursor-pointer transition-transform transform hover:scale-105"
                >
                    <Bars3Icon className="h-6 w-6" />
                    <span>Manage Quizzes</span>
                </button>
            </div>

            {/* Single toggle button for mobile screens */}
            <div className="sm:hidden flex space-x-2">
                <button
                    onClick={toggleDarkMode}
                    className="px-3 py-2 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer transition-transform transform hover:scale-105"
                >
                    {darkMode ? (
                        <MoonIcon className="h-6 w-6" />
                    ) : (
                        <SunIcon className="h-6 w-6" />
                    )}
                </button>

                <button
                    onClick={() => setCurrentView('manage')}
                    className="px-3 py-2 bg-green-600 text-white rounded-full flex items-center justify-center cursor-pointer transition-transform transform hover:scale-105"
                >
                    <Bars3Icon className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
};

export default Header;
