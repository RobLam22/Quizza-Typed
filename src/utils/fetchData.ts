type Questions = {
    category: string;
    correct_answer: string;
    difficulty: string;
    incorrect_answers: string[];
    question: string;
    type: string;
};

export async function apiCall(): Promise<Questions[] | null> {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10');
        const data = await response.json();
        console.log(data);
        return setupAnswers(data);
    } catch (error) {
        console.error('ERROR', error);
        return null;
    }
}
