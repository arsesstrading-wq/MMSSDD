import React from 'react';
import type { User, Language } from '../types';
import Avatar from './Avatar';
import { toPersianNum } from '../utils';
import type { strings } from '../localization/strings';

interface MyJourneyWidgetProps {
    user: User;
    t: (key: keyof typeof strings.fa) => string;
    language: Language;
}

const LEVEL_THRESHOLD = 100;

const MyJourneyWidget: React.FC<MyJourneyWidgetProps> = ({ user, t, language }) => {
    const level = Math.floor(user.xp / LEVEL_THRESHOLD) + 1;
    const xpForNextLevel = LEVEL_THRESHOLD;
    const currentLevelXp = user.xp % LEVEL_THRESHOLD;
    const progressPercent = (currentLevelXp / xpForNextLevel) * 100;
    
    // Simple streak calculation (placeholder)
    const uniqueLogDays = new Set(user.logs.map(log => log.jalaliDate)).size;

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex items-center space-x-4 rtl:space-x-reverse">
            <Avatar avatar={user.avatar} level={level} />
            <div className="flex-grow">
                <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">{t('myJourney')}</h3>
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{t('level')} {toPersianNum(level, language)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{t('xp')}: {toPersianNum(currentLevelXp, language)} / {toPersianNum(xpForNextLevel, language)}</span>
                    <span>🔥 {toPersianNum(uniqueLogDays, language)} {t('activeDays')}</span>
                </div>
            </div>
        </div>
    );
};

export default MyJourneyWidget;