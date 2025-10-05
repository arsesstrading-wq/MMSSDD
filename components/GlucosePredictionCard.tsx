import React from 'react';
import { GeminiIcon } from './Icons';
import type { strings } from '../localization/strings';
import type { Language, ModalContent } from '../types';
import { toPersianNum } from '../utils';

interface GlucosePredictionCardProps {
  isEstimating: boolean;
  lastPrediction: { value: number; timestamp: Date } | null;
  onEstimate: () => void;
  onStartComparison: (predictedValue: number) => void;
  canEstimate: boolean;
  t: (key: keyof typeof strings.fa) => string;
  language: Language;
  setModalContent: (content: ModalContent | null) => void;
}

const GlucosePredictionCard: React.FC<GlucosePredictionCardProps> = ({ isEstimating, lastPrediction, onEstimate, onStartComparison, canEstimate, t, language, setModalContent }) => {
  const showExplanation = () => {
    setModalContent({
      title: t('whatIsSmartEstimation'),
      message: t('smartEstimationExplanation')
    });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 text-center flex flex-col justify-between h-full">
      <div className="flex justify-center items-center gap-2">
        <GeminiIcon isActive className="h-6 w-6" />
        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">{t('whatsYourBS')}</h3>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center py-2 min-h-[150px]">
        {!lastPrediction ? (
          <div className="w-full flex flex-col items-center justify-center">
             <button 
                onClick={onEstimate} 
                disabled={!canEstimate || isEstimating}
                className="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed active:scale-95 flex-shrink-0"
                aria-label={isEstimating ? t('estimating') : t('estimateForMe')}
              >
                {isEstimating ? 
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div> : 
                  <GeminiIcon isActive className="h-10 w-10" />
                }
              </button>
              {!canEstimate && <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{t('noInternetConnection')}</p>}
          </div>
        ) : (
          <div className="animate-fade-in w-full px-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('estimateAt')} {toPersianNum(lastPrediction.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), language)}</p>
            <p className="text-6xl font-bold my-1 text-primary-600 dark:text-primary-400">~{toPersianNum(lastPrediction.value, language)}</p>
            <button onClick={() => onStartComparison(lastPrediction.value)} className="w-full mt-2 bg-green-600 text-white py-2.5 rounded-lg font-semibold text-sm shadow-md hover:bg-green-700 transition-colors">
              {t('compareWithReal')}
            </button>
          </div>
        )}
      </div>
      
       <button onClick={showExplanation} className="text-xs text-gray-500 dark:text-gray-400 mt-2 hover:underline">
          {t('whatIsThis')}
        </button>
    </div>
  );
};

export default GlucosePredictionCard;
