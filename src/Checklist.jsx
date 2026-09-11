import { useEffect, useState } from 'react'

const KEY = 'preview-lab-checklist'

const STEPS = [
  'Импортировать репозиторий в Vercel и дождаться первого прод-деплоя с main',
  'Включить в Settings → Environment Variables тумблер автоэкспорта системных переменных',
  'Завести ветку: git checkout -b experiment/red-banner',
  'Поменять MARKER в src/marker.js — заголовок и цвет',
  'Запушить ветку и найти в Vercel отдельный preview-деплой',
  'Открыть pull request и увидеть комментарий бота со ссылкой на preview',
  'Сравнить: на preview новая версия, на проде — старая',
  'Добавить переменную MY_GREETING отдельно для Preview и для Production, сравнить /api/info',
  'Сделать второй коммит в ту же ветку — preview-URL коммита новый, URL ветки тот же',
  'Смёржить PR и посмотреть, как main уезжает в production',
]

export default function Checklist() {
  const [done, setDone] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) ?? []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(done))
    } catch {
      /* приватный режим — просто не сохраняем */
    }
  }, [done])

  const toggle = (i) =>
    setDone((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))

  const pct = Math.round((done.length / STEPS.length) * 100)

  return (
    <section className="card">
      <h3>План эксперимента</h3>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${pct}%` }} />
      </div>
      <p className="muted small">
        Пройдено {done.length} из {STEPS.length}. Галочки живут в localStorage браузера, так что на
        каждом preview-домене они свои — это тоже показательно.
      </p>
      <ul className="steps">
        {STEPS.map((step, i) => (
          <li key={i}>
            <label>
              <input type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} />
              <span className={done.includes(i) ? 'struck' : undefined}>{step}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}
