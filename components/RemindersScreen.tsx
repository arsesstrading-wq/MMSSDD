import React, { useState } from 'react';
import type { View, User, Reminder, Language } from '../types';
import Header from './Header';
import { PlusIcon, DeleteIcon, ClockIcon } from './Icons';
import type { strings } from '../localization/strings';
import { toPersianNum } from '../utils';

interface RemindersScreenProps {
  setView: (view: View) => void;
  currentUser: User;
  onUpdateUser: (user: User) => void;
  t: (key: keyof typeof strings.fa) => string;
  language: Language;
}

const RemindersScreen: React.FC<RemindersScreenProps> = ({ setView, currentUser, onUpdateUser, t, language }) => {
  const [showForm, setShowForm] = useState(false);
  const [newReminder, setNewReminder] = useState<{ type: Reminder['type']; time: string }>({ type: 'check_bg', time: '08:00' });

  const handleToggle = (id: string) => {
    const updatedReminders = currentUser.reminders.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    onUpdateUser({ ...currentUser, reminders: updatedReminders });
  };

  const handleDelete = (id: string) => {
    const updatedReminders = currentUser.reminders.filter(r => r.id !== id);
    onUpdateUser({ ...currentUser, reminders: updatedReminders });
  };

  const handleAdd = () => {
    if (newReminder.time) {
      const reminder: Reminder = {
        id: `reminder_${Date.now()}`,
        ...newReminder,
        enabled: true,
      };
      onUpdateUser({ ...currentUser, reminders: [...currentUser.reminders, reminder] });
      setShowForm(false);
      setNewReminder({ type: 'check_bg', time: '08:00' });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
      <Header title={t('remindersTitle')} onBack={() => setView('settings')} />
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {currentUser.reminders.length === 0 && !showForm && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <ClockIcon className="mx-auto h-12 w-12 mb-2" />
            <p>{t('noReminders')}</p>
          </div>
        )}

        <ul className="space-y-3">
          {currentUser.reminders.map(reminder => (
            <li key={reminder.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex justify-between items-center shadow-sm">
              <div>
                <p className="font-bold text-lg">{toPersianNum(reminder.time, language)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t(`reminderType_${reminder.type}`)}</p>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {/* Toggle Switch */}
                <label htmlFor={`toggle-${reminder.id}`} className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id={`toggle-${reminder.id}`}
                    className="sr-only peer"
                    checked={reminder.enabled}
                    onChange={() => handleToggle(reminder.id)}
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] rtl:after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                </label>
                <button onClick={() => handleDelete(reminder.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                  <DeleteIcon className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {showForm && (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg space-y-3 animate-fade-in">
            <h3 className="font-bold text-lg">{t('addReminder')}</h3>
            <div>
              <label htmlFor="reminderType" className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">{t('reminderType')}</label>
              <select
                id="reminderType"
                value={newReminder.type}
                onChange={e => setNewReminder({ ...newReminder, type: e.target.value as Reminder['type'] })}
                className="w-full p-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
              >
                <option value="check_bg">{t('reminderType_check_bg')}</option>
                <option value="take_meds">{t('reminderType_take_meds')}</option>
              </select>
            </div>
            <div>
              <label htmlFor="reminderTime" className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">{t('reminderTime')}</label>
              <input
                id="reminderTime"
                type="time"
                value={newReminder.time}
                onChange={e => setNewReminder({ ...newReminder, time: e.target.value })}
                className="w-full p-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
              />
            </div>
            <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-500 rounded-lg">{t('cancel')}</button>
              <button onClick={handleAdd} className="px-4 py-2 bg-primary-600 text-white rounded-lg">{t('addReminder')}</button>
            </div>
          </div>
        )}
      </div>

      {!showForm && (
        <div className="fixed bottom-24 ltr:right-6 rtl:left-6 z-20">
            <button
              onClick={() => setShowForm(true)}
              style={{ background: 'linear-gradient(to top right, var(--gradient-start), var(--gradient-end))' }}
              className="text-white rounded-full p-4 shadow-lg hover:opacity-90 active:scale-95 transition-all duration-200"
              aria-label={t('addReminder')}
              title={t('addReminder')}
            >
              <PlusIcon />
            </button>
        </div>
      )}
    </div>
  );
};

export default RemindersScreen;
