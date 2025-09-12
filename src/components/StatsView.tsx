import React from 'react';
import { TrendingUp, Award, Calendar, Target, Recycle, Users } from 'lucide-react';

interface StatsViewProps {
  userType: 'collector' | 'poster';
  stats: any;
  onQuickAction?: (action: string) => void;
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

  // Get current time for greeting
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'Buenos días';
    if (currentHour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };
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
              {isCollector 
                ? 'Listo para hacer la diferencia hoy' 
                : 'Tu impacto positivo en el planeta'
              }
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${isCollector ? 'text-green-600' : 'text-blue-600'}`}>
                  {isCollector ? stats.totalPickups : stats.totalPoints}
                </div>
                <div className="text-sm text-gray-600">
                  {isCollector ? 'Recolecciones' : 'Puntos totales'}
                </div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">
                  {stats.rating}
                </div>
                <div className="text-sm text-gray-600">Calificación</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className={`w-5 h-5 mr-2 ${isCollector ? 'text-green-600' : 'text-blue-600'}`} />
            Resumen de Hoy
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {isCollector ? (
              <>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.completedToday}</div>
                  <div className="text-sm text-gray-600">Recolecciones hoy</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">5</div>
                  <div className="text-sm text-gray-600">Meta diaria</div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.pointsThisWeek || 45}</div>
                  <div className="text-sm text-gray-600">Puntos esta semana</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.activeItems || 3}</div>
                  <div className="text-sm text-gray-600">Elementos activos</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className={`w-5 h-5 mr-2 ${isCollector ? 'text-green-600' : 'text-blue-600'}`} />
              Actividad Semanal
            </h3>
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

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">Logros Recientes</h3>
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

        {/* Quick Actions */}
        {!isCollector && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center space-x-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                onClick={() => onQuickAction && onQuickAction('bags')}
                <span className="text-xl">📦</span>
                <span className="text-sm font-medium text-blue-700">Publicar</span>
              </button>
              <button className="flex items-center justify-center space-x-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                onClick={() => onQuickAction && onQuickAction('rankings')}
                <span className="text-xl">📊</span>
                <span className="text-sm font-medium text-green-700">Ver Ranking</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}