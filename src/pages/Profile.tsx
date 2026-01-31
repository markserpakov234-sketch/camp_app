export default function Profile({ user, onLogout }: any) {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Профиль</h1>
      <p>
        <b>ФИО:</b> {user.name}
      </p>
      <p>
        <b>Отряд:</b> {user.squad}
      </p>

      <button
        onClick={onLogout}
        className="mt-6 w-full bg-red-500 text-white py-2 rounded"
      >
        Выйти
      </button>
    </div>
  );
}
