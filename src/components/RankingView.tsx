import React from 'react';
import { Trophy, TrendingUp, Users, MapPin, Star, Award, Target } from 'lucide-react';

interface RankingViewProps {
  posterStats: {
    totalPoints: number;
    pointsThisWeek: number;
    totalPosts: number;
    rating: number;
  };
}

export default function RankingView({ posterStats }: RankingViewProps) {
  // Mock ranking data
  const neighborhoodRank = 7;
  const totalNeighbors = 45;
  const nationalPercentile = 68; // Top 68% in Mexico
  const cityRank = 234;
  const totalCityUsers = 12500;

  // Get current time for greeting
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'Buenos días';
    if (currentHour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const neighborhoodLeaders = [
    { name: 'María González', points: 4250, isUser: false },
    { name: 'Carlos Ruiz', points: 3890, isUser: false },
    { name: 'Ana López', points: 3650, isUser: false },
    { name: 'Roberto Silva', points: 3420, isUser: false },
    { name: 'Laura Martínez', points: 3180, isUser: false },
    { name: 'Diego Hernández', points: 2950, isUser: false },
    { name: 'Tú', points: posterStats.totalPoints, isUser: true },
    { name: 'Sofia Ramírez', points: 2650, isUser: false },
    { name: 'Miguel Torres', points: 2480, isUser: false }
  ];

  const getPercentileMessage = (percentile: number) => {
    if (percentile >= 90) return { text: 'Top 10% en México', color: 'text-yellow-600 bg-yellow-100', icon: '🏆' };
    if (percentile >= 75) return { text: 'Top 25% en México', color: 'text-green-600 bg-green-100', icon: '🥇' };
    if (percentile >= 50) return { text: 'Top 50% en México', color: 'text-blue-600 bg-blue-100', icon: '🥈' };
    if (percentile >= 25) return { text: 'Top 75% en México', color: 'text-purple-600 bg-purple-100', icon: '🥉' };
    return { text: 'Top 100% en México', color: 'text-gray-600 bg-gray-100', icon: '🌟' };
  };

  const percentileInfo = getPercentileMessage(nationalPercentile);

  return (
    <div className="h-full bg-gray-50">
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {getGreeting()} 👋
            </h1>
            <p className="text-gray-600 mb-4">
              Tu posición en la comunidad EcoCiclo
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  #{neighborhoodRank}
                </div>
                <div className="text-sm text-gray-600">
                  En tu vecindario
                </div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">
                  {posterStats.totalPoints}
                </div>
                <div className="text-sm text-gray-600">Puntos totales</div>
              </div>
            </div>
          </div>
        </div>

        {/* National Ranking Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center space-x-2 mb-4">
            <Trophy className="w-6 h-6" />
            <h3 className="text-lg font-bold">Ranking Nacional</h3>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-3xl">{percentileInfo.icon}</span>
              <p className="text-sm opacity-90 mt-1">México</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{posterStats.totalPoints}</div>
              <div className="text-sm opacity-90">puntos totales</div>
            </div>
          </div>
          
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${percentileInfo.color} text-sm font-semibold`}>
            <Award className="w-4 h-4 mr-2" />
            {percentileInfo.text}
          </div>
          
          <div className="mt-4 text-sm opacity-90">
            Posición #{cityRank.toLocaleString()} de {totalCityUsers.toLocaleString()} en tu ciudad
          </div>
        </div>

        {/* Neighborhood Ranking */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Ranking Vecinal</h3>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Posición #{neighborhoodRank} de {totalNeighbors} vecinos
              </p>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Col. Roma Norte</span>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {neighborhoodLeaders.map((user, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 ${
                  user.isUser ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    user.isUser ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className={`font-medium ${user.isUser ? 'text-blue-900' : 'text-gray-900'}`}>
                      {user.name}
                      {user.isUser && <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Tú</span>}
                    </div>
                    {index < 3 && !user.isUser && (
                      <div className="text-xs text-gray-500">
                        {index === 0 ? '🏆 Líder del vecindario' :
                         index === 1 ? '🥈 Segundo lugar' :
                         '🥉 Tercer lugar'}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${user.isUser ? 'text-blue-600' : 'text-gray-900'}`}>
                    {user.points.toLocaleString()} pts
                  </div>
                  {user.isUser && (
                    <div className="text-xs text-blue-600">
                      +{posterStats.pointsThisWeek} esta semana
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Progreso Esta Semana
          </h3>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-blue-600">+{posterStats.pointsThisWeek}</div>
            <div className="text-sm text-gray-600">puntos ganados</div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Meta semanal</span>
                <span className="font-medium">{posterStats.pointsThisWeek}/200 pts</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((posterStats.pointsThisWeek / 200) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{posterStats.totalPosts}</div>
                <div className="text-xs text-gray-600">Publicaciones totales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{posterStats.rating}</div>
                <div className="text-xs text-gray-600">Calificación promedio</div>
              </div>
            </div>
          </div>
        </div>

        {/* Challenges */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 text-purple-600" />
            <span className="ml-2">Desafíos Activos</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <div className="font-medium text-gray-900">Subir 3 posiciones</div>
                  <div className="text-sm text-gray-600">En el ranking vecinal</div>
                </div>
              </div>
              <div className="text-purple-600 font-semibold">+50 pts</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📦</span>
                <div>
                  <div className="font-medium text-gray-900">5 publicaciones esta semana</div>
                  <div className="text-sm text-gray-600">Progreso: 3/5</div>
                </div>
              </div>
              <div className="text-green-600 font-semibold">+30 pts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}