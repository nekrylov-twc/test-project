// Показывается, когда Vercel не отдал системные переменные в сборку.
// Это самая частая причина, по которой страница выглядит пустой.
export default function SetupHint() {
  return (
    <section className="card warn">
      <h3>Страница пустая? Включи системные переменные</h3>
      <p className="small">
        Vite вшивает в бандл только переменные с префиксом <code>VITE_</code>. Vercel добавляет этот
        префикс к своим переменным не всегда, а по отдельному чекбоксу. Пока он выключен, сборка не
        знает ни ветки, ни коммита, ни окружения.
      </p>
      <ol className="steps-num">
        <li>Открой проект в дашборде Vercel</li>
        <li>
          <strong>Settings</strong> → в левом меню <strong>Environment Variables</strong>
        </li>
        <li>
          Найди чекбокс <strong>«Enable access to System Environment Variables»</strong> — он на этой
          же странице, над списком переменных, а не в общих настройках
        </li>
        <li>
          Включи его и <strong>передеплой</strong>: Deployments → ⋯ у последнего деплоя →{' '}
          <strong>Redeploy</strong>. Переменные вшиваются в момент сборки, поэтому старый билд сам по
          себе не починится
        </li>
      </ol>
      <p className="small muted">
        В документации Vercel это называется System Environment Variables; названия вида{' '}
        <code>VITE_VERCEL_ENV</code> — их фреймворочные версии для Vite.
      </p>
    </section>
  )
}
