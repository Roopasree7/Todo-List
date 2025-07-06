import React from 'react';
import Leaderboard from '../components/Leaderboard';
import { useTranslation } from 'react-i18next';

export default function LeaderboardPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-4">
        {t('leaderboard') || 'Leaderboard'}
      </h1>
      <Leaderboard />
    </div>
  );
}
