import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import clsx from 'clsx';

interface QuizProps {
  questions: QuizQuestion[];
}

export const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionClick = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    if (selectedOption === questions[currentQuestion].correctOptionIndex) {
      setScore(prev => prev + 1);
    }
    
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
        // End of quiz
    }
  };

  if (!questions || questions.length === 0) return null;

  const question = questions[currentQuestion];
  const isFinished = showResult && currentQuestion === questions.length - 1;

  return (
    <div className="bg-indigo-900 text-white rounded-2xl p-6 md:p-8 shadow-xl mt-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span>⚡</span> Quick Quiz
        </h3>
        <span className="text-sm bg-indigo-800 px-3 py-1 rounded-full">
          {currentQuestion + 1} / {questions.length}
        </span>
      </div>

      {isFinished ? (
        <div className="text-center py-8">
            <div className="text-6xl mb-4">🏆</div>
            <h4 className="text-2xl font-bold mb-2">Quiz Complete!</h4>
            <p className="text-indigo-200 mb-6">You scored {score} out of {questions.length}</p>
            <button 
                onClick={() => {
                    setCurrentQuestion(0);
                    setSelectedOption(null);
                    setShowResult(false);
                    setScore(0);
                }}
                className="bg-white text-indigo-900 font-bold py-2 px-6 rounded-lg hover:bg-indigo-100 transition-colors"
            >
                Retry
            </button>
        </div>
      ) : (
        <>
            <p className="text-lg md:text-xl font-medium mb-6">{question.question}</p>

            <div className="space-y-3 mb-6">
                {question.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === question.correctOptionIndex;
                
                let buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ";
                
                if (showResult) {
                    if (isCorrect) buttonClass += "bg-green-500 border-green-500 text-white";
                    else if (isSelected && !isCorrect) buttonClass += "bg-red-500 border-red-500 text-white";
                    else buttonClass += "bg-indigo-800/50 border-transparent text-indigo-200";
                } else {
                    if (isSelected) buttonClass += "bg-indigo-600 border-indigo-400 text-white";
                    else buttonClass += "bg-indigo-800/50 border-transparent hover:bg-indigo-700 text-indigo-100";
                }

                return (
                    <button
                    key={idx}
                    onClick={() => handleOptionClick(idx)}
                    className={buttonClass}
                    disabled={showResult}
                    >
                    <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showResult && isCorrect && <span>✅</span>}
                        {showResult && isSelected && !isCorrect && <span>❌</span>}
                    </div>
                    </button>
                );
                })}
            </div>

            <div className="flex justify-end">
                {!showResult ? (
                <button
                    onClick={handleSubmit}
                    disabled={selectedOption === null}
                    className="bg-white text-indigo-900 font-bold py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-100 transition-colors"
                >
                    Check Answer
                </button>
                ) : (
                <button
                    onClick={handleNext}
                    className="bg-white text-indigo-900 font-bold py-3 px-8 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                    {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish'}
                </button>
                )}
            </div>
        </>
      )}
    </div>
  );
};
