import { useEffect, useState } from 'react'

const KEY = 'preview-lab-checklist'

// Каждый шаг говорит не только что сделать, но и что должно произойти.
const STEPS = [
  {
    do: 'Включить чекбокс «Enable access to System Environment Variables»',
    see: 'Settings → Environment Variables, над списком переменных. После него нужен Redeploy.',
  },
  {
    do: 'Завести ветку и поменять MARKER в src/marker.js',
    see: 'git checkout -b experiment/red-banner — заголовок, текст и цвет.',
  },
  {
    do: 'Запушить ветку',
    see: 'В Deployments появится деплой со статусом Preview и своим адресом. Прод не шелохнулся.',
  },
  {
    do: 'Открыть preview и нажать «Открыть прод и сравнить»',
    see: 'Две вкладки рядом: слева новый маркер, справа старый. Это и есть весь смысл механизма.',
  },
  {
    do: 'Открыть pull request',
    see: 'Бот Vercel повесит в PR комментарий со ссылкой на preview — её и смотрят ревьюеры.',
  },
  {
    do: 'Сделать второй коммит в ту же ветку',
    see: 'Адрес ветки покажет новую версию, а старый адрес билда — по-прежнему первый коммит.',
  },
  {
    do: 'Завести переменную MY_GREETING с разными значениями для Preview и Production',
    see: 'В блоке про сервер значение customGreeting будет своё на preview и своё на проде.',
  },
  {
    do: 'Смёржить PR в main',
    see: 'Тот же код уезжает в production, бейдж в шапке становится зелёным.',
  },
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
      <h3>Что делать по шагам</h3>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${pct}%` }} />
      </div>
      <p className="muted small">
        Пройдено {done.length} из {STEPS.length}.
      </p>
      <ul className="steps">
        {STEPS.map((step, i) => (
          <li key={i}>
            <label>
              <input type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} />
              <span>
                <span className={done.includes(i) ? 'struck' : undefined}>{step.do}</span>
                <br />
                <span className="muted small">{step.see}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}
