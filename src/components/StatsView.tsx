import React from 'react';
import { TrendingUp, Award, Calendar, Target, Recycle, Users } from 'lucide-react';

interface StatsViewProps {
  userType: 'collector' | 'poster';
  stats: any;
}

export default function StatsView({ userType, stats }: StatsViewProps) {
  const isCollector = userType === 'collector';

  const weeklyData = [
    { day: 'L', value: isCollector ? 3 : 45 },
    { day: 'M', value: isCollector ? 5 : 60 },
    { day: 'M', value: isCollector ? 2 : 30 },
    { day: 'J', value: isCollector ? 4 : 75 },
    { day: 'V', value: isCollector ? 3 : 50 },
    { day: 'S', value: isCollector ? 6 : 90 },
    { day: 'D', value: isCollector ? 2 : 25 }
  ];

  const maxValue = Math.max(...weeklyData.map(d => d.value));

  return (
    <div className="h-full bg-gray-50">
      {/* Stats Header */}
      <div className={`${isCollector ? 'bg-green-600' : 'bg-blue-600'} text-white p-4`}>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6" />
          <div>
            <h2 className="text-lg font-bold">Estadísticas</h2>
            <p className="text-sm opacity-90">
              {isCollector ? 'Tu rendimiento como recolector' : 'Tu impacto ambiental'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-8 h-8 ${isCollector ? 'bg-green-100' : 'bg-blue-100'} rounded-full flex items-center justify-center`}>
                <Recycle className={`w-4 h-4 ${isCollector ? 'text-green-600' : 'text-blue-600'}`} />
              </div>
              <span className="text-sm text-gray-600">
                {isCollector ? 'Recolecciones' : 'Publicaciones'}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {isCollector ? stats.totalPickups : stats.totalPosts}
            </div>
            <div className="text-xs text-green-600">
              +{isCollector ? '12' : '3'} esta semana
            </div>
          </div>

          {!isCollector && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-600">
                  Puntos
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalPoints}
              </div>
              <div className="text-xs text-green-600">
                +{stats.pointsThisWeek || 45} esta semana
              </div>
            </div>
          )}
        </div>

        {isCollector && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">
                Recolecciones Hoy
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.completedToday}
            </div>
            <div className="text-xs text-green-600">
              Meta diaria: 5
            </div>
          </div>
        )}

        {/* Weekly Chart */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Esta Semana</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="flex items-end justify-between h-32 mb-2">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div
                  className={`w-6 ${isCollector ? 'bg-green-500' : 'bg-blue-500'} rounded-t transition-all duration-500`}
                  style={{ height: `${(day.value / maxValue) * 100}px` }}
                ></div>
                <span className="text-xs text-gray-600">{day.day}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center text-sm text-gray-600">
            {isCollector ? 'Recolecciones por día' : 'Puntos ganados por día'}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">Logros</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🏆</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {isCollector ? 'Recolector Estrella' : 'Eco Warrior'}
                </div>
                <div className="text-xs text-gray-600">
                  {isCollector ? '100+ recolecciones completadas' : '1000+ puntos ganados'}
                </div>
              </div>
              <div className="text-xs text-green-600 font-medium">Completado</div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🌱</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {isCollector ? 'Eco Héroe' : 'Planeta Protector'}
                </div>
                <div className="text-xs text-gray-600">
                  {isCollector ? '50kg de material recolectado' : '25kg de material publicado'}
                </div>
              </div>
              <div className="text-xs text-green-600 font-medium">Completado</div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {isCollector ? 'Velocidad Luz' : 'Publicador Rápido'}
                </div>
                <div className="text-xs text-gray-600">
                  {isCollector ? '10 recolecciones en un día' : '500 puntos en un día'}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div className={`${isCollector ? 'bg-green-500' : 'bg-blue-500'} h-1 rounded-full`} style={{ width: '70%' }}></div>
                </div>
              </div>
              <div className="text-xs text-gray-600">7/10</div>
            </div>
          </div>
        </div>

        {/* Rating & Reviews */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900">Calificación</h3>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.rating}</div>
            <div className="flex justify-center space-x-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`text-lg ${star <= Math.floor(stats.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                  ⭐
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-600">
              Basado en {isCollector ? '127' : '89'} calificaciones
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-4 text-white">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-2xl">🌍</span>
            <h3 className="text-lg font-semibold">Impacto Ambiental</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">
                {isCollector ? '127kg' : '89kg'}
              </div>
              <div className="text-sm opacity-90">{isCollector ? 'Material recolectado' : 'Material reciclado'}</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {isCollector ? '2.1' : '1.8'}
              </div>
              <div className="text-sm opacity-90">Toneladas CO₂ evitadas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}