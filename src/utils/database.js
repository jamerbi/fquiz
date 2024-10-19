const DB_NAME = 'QuizAppDB';
const STORE_NAME = 'quizzes';

export const initializeDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onerror = (event) => reject("IndexedDB error: " + event.target.error);

        request.onsuccess = (event) => resolve(event.target.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        };
    });
};

export const saveQuizToDB = (quiz) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const addRequest = store.put(quiz);

            addRequest.onsuccess = () => resolve();
            addRequest.onerror = () => reject(addRequest.error);
        };

        request.onerror = () => reject(request.error);
    });
};

export const loadQuizzesFromDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);

            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = () => resolve(getAllRequest.result);
            getAllRequest.onerror = () => reject(getAllRequest.error);
        };

        request.onerror = () => reject(request.error);
    });
};

export const updateQuizStats = (quizId, quizResults) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const getRequest = store.get(quizId);

            getRequest.onsuccess = () => {
                const quiz = getRequest.result;

                quiz.stats.timesCompleted++;
                quiz.stats.averageTime = (quiz.stats.averageTime * (quiz.stats.timesCompleted - 1) + quizResults.time) / quiz.stats.timesCompleted;
                quiz.stats.questionsAnswered += quizResults.answeredQuestions;

                quizResults.questionResults.forEach((result) => {
                    const questionStat = quiz.stats.questionStats.find(stat => stat.id === result.id);
                    if (questionStat) {
                        questionStat.timesAnswered++;
                        if (result.correct) {
                            questionStat.timesCorrect++;
                        }
                    }
                });

                const updateRequest = store.put(quiz);
                updateRequest.onsuccess = () => resolve();
                updateRequest.onerror = () => reject(updateRequest.error);
            };

            getRequest.onerror = () => reject(getRequest.error);
        };

        request.onerror = () => reject(request.error);
    });
};

// Unit tests for the utility functions
describe('Database Utility Functions', () => {
    test('initializeDB should initialize the database', async () => {
        const db = await initializeDB();
        expect(db.name).toBe(DB_NAME);
    });

    test('saveQuizToDB should save a quiz to the database', async () => {
        const quiz = { id: 1, name: 'Sample Quiz' };
        await saveQuizToDB(quiz);
        const quizzes = await loadQuizzesFromDB();
        expect(quizzes).toContainEqual(quiz);
    });

    test('loadQuizzesFromDB should load quizzes from the database', async () => {
        const quiz = { id: 2, name: 'Another Quiz' };
        await saveQuizToDB(quiz);
        const quizzes = await loadQuizzesFromDB();
        expect(quizzes).toContainEqual(quiz);
    });

    test('updateQuizStats should update the quiz statistics', async () => {
        const quiz = { id: 3, name: 'Stats Quiz', stats: { timesCompleted: 0, averageTime: 0, questionsAnswered: 0, questionStats: [] } };
        await saveQuizToDB(quiz);
        const quizResults = { time: 10, answeredQuestions: 5, questionResults: [] };
        await updateQuizStats(quiz.id, quizResults);
        const quizzes = await loadQuizzesFromDB();
        const updatedQuiz = quizzes.find(q => q.id === quiz.id);
        expect(updatedQuiz.stats.timesCompleted).toBe(1);
        expect(updatedQuiz.stats.averageTime).toBe(10);
        expect(updatedQuiz.stats.questionsAnswered).toBe(5);
    });
});
