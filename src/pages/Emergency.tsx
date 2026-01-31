import {
  Phone,
  AlertTriangle,
  MapPin,
  HeartPulse,
} from 'lucide-react';

export default function Emergency() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24">
      {/* 🟧 ВЕРХНЯЯ ПЛАШКА */}
      <div className="bg-orange-500 text-white rounded-3xl p-6 shadow-lg mb-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-7 h-7" />
          <div>
            <div className="text-sm opacity-90">Экстренно</div>
            <div className="text-xl font-extrabold">
              Если нужна помощь
            </div>
          </div>
        </div>
      </div>

      {/* 🫶 УСПОКАИВАЮЩИЙ ТЕКСТ */}
      <div className="bg-white rounded-2xl p-4 shadow mb-6">
        <div className="flex items-center gap-3 mb-2">
          <HeartPulse className="w-5 h-5 text-green-600" />
          <div className="font-semibold text-gray-800">
            Главное — не паниковать
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Если случилась неприятная ситуация —
          обратись к старшему вожатому или медицинскому персоналу.
          Эта страница поможет быстро сориентироваться.
        </p>
      </div>

      {/* 📞 КОНТАКТЫ */}
      <div className="mb-6">
        <div className="text-sm font-semibold text-gray-600 mb-2">
          Контакты лагеря
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
            <Phone className="w-6 h-6 text-orange-500" />
            <div>
              <div className="font-semibold">Дежурный вожатый</div>
              <div className="text-sm text-gray-500">
                Телефон: +7 (XXX) XXX-XX-XX
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
            <HeartPulse className="w-6 h-6 text-red-500" />
            <div>
              <div className="font-semibold">Медпункт</div>
              <div className="text-sm text-gray-500">
                Круглосуточно
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
            <MapPin className="w-6 h-6 text-green-600" />
            <div>
              <div className="font-semibold">Место сбора</div>
              <div className="text-sm text-gray-500">
                Центральная площадь лагеря
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ⚠️ ВРЕМЕННОЕ УВЕДОМЛЕНИЕ */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
        <div className="text-sm font-semibold text-orange-700 mb-1">
          Важно
        </div>
        <p className="text-sm text-orange-700">
          В будущем здесь появится кнопка быстрого вызова помощи
          и отправка местоположения.
        </p>
      </div>
    </div>
  );
}
