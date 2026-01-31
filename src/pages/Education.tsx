import { BookOpen } from 'lucide-react';

export default function Education() {
  return (
    <div className="p-4 space-y-4">

      {/* Заголовок */}
      <div className="bg-white rounded-2xl p-5 shadow">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
            <BookOpen className="text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold">
              Обучение
            </h1>
            <p className="text-sm text-gray-500">
              Школа Республики Виталия
            </p>
          </div>
        </div>
      </div>

      {/* Плашка-заглушка */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 space-y-2">
        <p className="font-semibold text-orange-900">
          📚 Скоро здесь появятся занятия
        </p>
        <p className="text-sm text-orange-800">
          Курсы, мастер-классы, полезные навыки и обучение в лагере.
        </p>
      </div>

      {/* Будущие блоки (визуальный каркас) */}
      <div className="space-y-3 opacity-50">
        <div className="h-20 bg-gray-100 rounded-xl" />
        <div className="h-20 bg-gray-100 rounded-xl" />
      </div>

    </div>
  );
}
