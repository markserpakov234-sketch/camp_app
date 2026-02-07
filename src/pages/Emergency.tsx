import {
  Phone,
  AlertTriangle,
  MapPin,
  HeartPulse,
} from 'lucide-react';

export default function Emergency() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-purple-50 p-4 pb-24">

      {/* 🌈 Фоновые blur-пятна */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-300/30 rounded-full blur-3xl" />
      <div className="absolute top-40 -right-32 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-pink-200/20 rounded-full blur-3xl" />

      <div className="relative z-10 space-y-6">

        {/* 🟧 Верхняя карточка */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/40">
          <div className="flex items-start gap-4">

            {/* Иконка */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shrink-0">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>

            {/* Текст */}
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Экстренная ситуация
              </div>

              <h1 className="text-3xl sm:text-4xl font-black leading-tight text-gray-900">
                Нужна помощь?
              </h1>

              <div className="text-sm text-gray-500 font-medium">
                Мы рядом. Действуй спокойно.
              </div>
            </div>

          </div>
        </div>

        {/* 🫶 Успокаивающий блок */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-5 shadow-lg border border-white/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div className="font-semibold text-gray-900">
              Главное — не паниковать
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            Если произошла неприятная ситуация — обратись к старшему вожатому
            или медицинскому персоналу.  
            Эта страница поможет быстро сориентироваться и принять правильное решение.
          </p>
        </div>

        {/* 📞 Контакты */}
        <div>
          <div className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            Контакты лагеря
          </div>

          <div className="space-y-4">

            {/* Дежурный */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-4 shadow-lg border border-white/40 flex items-center gap-4 hover:shadow-xl transition">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Дежурный вожатый
                </div>
                <div className="text-sm text-gray-500">
                  +7 (XXX) XXX-XX-XX
                </div>
              </div>
            </div>

            {/* Медпункт */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-4 shadow-lg border border-white/40 flex items-center gap-4 hover:shadow-xl transition">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Медпункт
                </div>
                <div className="text-sm text-gray-500">
                  Круглосуточно
                </div>
              </div>
            </div>

            {/* Место сбора */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-4 shadow-lg border border-white/40 flex items-center gap-4 hover:shadow-xl transition">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Место сбора
                </div>
                <div className="text-sm text-gray-500">
                  Центральная площадь лагеря
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ⚠️ Информационный блок */}
        <div className="bg-gradient-to-br from-orange-100 to-orange-50 border border-orange-200 rounded-3xl p-4 shadow-inner">
          <div className="text-sm font-semibold text-orange-700 mb-1">
            Важно
          </div>
          <p className="text-sm text-orange-700 leading-relaxed">
            В будущем здесь появится кнопка быстрого вызова помощи
            и автоматическая отправка местоположения.
          </p>
        </div>

      </div>
    </div>
  );
}
