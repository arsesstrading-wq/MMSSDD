import React from 'react';
import type { User, View, ModalContent, Language, LogEntry } from '../types';
import {
  BloodDropIcon, MealIcon, ActivityIcon, SyringeIcon,
  MoodIcon, BodyIcon, MedicationIcon, SleepIcon
} from './Icons';
import GlucosePredictionCard from './GlucosePredictionCard';
import MyJourneyWidget from './MyJourneyWidget'; // Import the new widget
import { getGlucoseColorClass } from '../constants';
import type { strings } from '../localization/strings';
import type dynamicStrings from '../localization/dynamicStrings';
import { toPersianNum } from '../utils';

interface DashboardTimelineProps {
  currentUser: User;
  setView: (view: View) => void;
  setModalContent: (content: ModalContent | null) => void;
  isEstimating: boolean;
  lastPrediction: { value: number; timestamp: Date } | null;
  onEstimate: () => void;
  onStartComparison: (predictedValue: number) => void;
  canEstimate: boolean;
  t: (key: keyof typeof strings.fa) => string;
  dynamicT: typeof dynamicStrings.fa;
  language: Language;
}

const getIconForLog = (log: LogEntry) => {
    const props = { className: "h-5 w-5 text-white" };
    switch (log.type) {
        case 'bloodSugar': return <BloodDropIcon {...props} />;
        case 'meal': return <MealIcon {...props} />;
        case 'activity': return <ActivityIcon {...props} />;
        case 'insulin': return <SyringeIcon {...props} />;
        case 'mood': return <MoodIcon {...props} />;
        case 'physicalCondition': return <BodyIcon {...props} />;
        case 'medication': return <MedicationIcon {...props} />;
        case 'sleep': return <SleepIcon {...props} />;
        default: return null;
    }
};

const getBackgroundColorForLog = (log: LogEntry): string => {
    switch (log.type) {
        case 'bloodSugar': return getGlucoseColorClass(log.glucose).replace('text-', 'bg-').replace('-font-bold', '').trim();
        case 'meal': return 'bg-orange-500';
        case 'activity': return 'bg-sky-500';
        case 'insulin': return 'bg-indigo-500';
        default: return 'bg-gray-500';
    }
}

const TimelineItem: React.FC<{ log: LogEntry; t: DashboardTimelineProps['t']; dynamicT: DashboardTimelineProps['dynamicT']; language: Language }> = React.memo(({ log, t, dynamicT, language }) => {
    const renderContent = () => {
        switch (log.type) {
            case 'bloodSugar': return <><span className="font-bold text-lg">{toPersianNum(log.glucose, language)}</span> mg/dL</>;
            case 'meal': return <><span className="font-bold text-lg">{toPersianNum(log.carbs, language)}</span> {t('gram')} - {log.description || dynamicT.getMealTypeName(log.mealType)}</>;
            case 'activity': return <><span className="font-bold">{log.activityType}</span> - {toPersianNum(log.duration, language)} {t('minute')}</>;
            case 'insulin': return <><span className="font-bold">{toPersianNum(log.insulinDose, language)} {t('unit')}</span> {log.insulinType}</>;
            default: return <span className="font-bold">{log.description || log.type}</span>;
        }
    };

    return (
        <div className="flex items-start timeline-item">
            <div className="flex flex-col items-center mr-4 rtl:mr-0 rtl:ml-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${getBackgroundColorForLog(log)}`}>
                    {getIconForLog(log)}
                </div>
                <div className="w-px h-full bg-gray-300 dark:bg-gray-600 timeline-connector"></div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700 w-full -mt-2">
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>{t(`logMenu${log.type.charAt(0).toUpperCase() + log.type.slice(1)}` as any)}</span>
                    <span>{toPersianNum(log.time, language)}</span>
                </div>
                <p className="text-gray-800 dark:text-gray-100 mt-1 text-sm">{renderContent()}</p>
            </div>
        </div>
    );
});

const DashboardTimeline: React.FC<DashboardTimelineProps> = (props) => {
    const { currentUser, t, dynamicT, language } = props;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysLogs = currentUser.logs
        .filter(log => new Date(log.timestamp) >= today)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const lastBgLog = [...currentUser.logs]
        .filter(l => l.type === 'bloodSugar' && l.glucose)
        .sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

    const todayJalali = new Date().toLocaleDateString('fa-IR-u-nu-latn', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="sticky top-0 z-10 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700" style={{ paddingTop: 'calc(1rem + var(--safe-area-inset-top))' }}>
                <h1 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100">{t('appName')}</h1>
                <p className="text-center text-xs text-gray-500 dark:text-gray-400">{toPersianNum(todayJalali, language)}</p>
            </div>
            
            {/* Main Content */}
            <div className="flex-grow overflow-y-auto px-4 pb-24 pt-4 space-y-6">
                <MyJourneyWidget user={currentUser} t={t} language={language} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Summary & AI */}
                    <div className="space-y-6">
                         <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700 animate-fade-in">
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-2">{t('lastReading')}</p>
                            {lastBgLog ? (
                                <div className="text-center">
                                    <span className={`text-5xl font-bold ${getGlucoseColorClass(lastBgLog.glucose)}`}>
                                        {toPersianNum(lastBgLog.glucose, language)}
                                    </span>
                                    <span className="text-lg text-gray-600 dark:text-gray-300 ml-1">mg/dL</span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('time')}: {toPersianNum(lastBgLog.time, language)}</p>
                                </div>
                            ) : (
                                 <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('noDataYet')}</p>
                            )}
                        </div>
                        <GlucosePredictionCard {...props} />
                    </div>

                    {/* Right Column: Timeline */}
                    <div className="space-y-4 md:mt-0">
                        {todaysLogs.length > 0 ? (
                            todaysLogs.map(log => <TimelineItem key={log.id} log={log} t={t} dynamicT={dynamicT} language={language} />)
                        ) : (
                            <div className="text-center py-10 h-full flex flex-col justify-center items-center bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                                <p className="text-gray-500 dark:text-gray-400">{t('noDataToday')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardTimeline;