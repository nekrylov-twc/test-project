import { useCallback, useEffect, useState } from 'react'

const STATES = { loading: 'loading', ok: 'ok', absent: 'absent', fail: 'fail' }

export default function ServerProbe() {
  const [state, setState] = useState(STATES.loading)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setState(STATES.loading)
    setError(null)
    try {
      const res = await fetch('/api/info', { cache: 'no-store' })
      const type = res.headers.get('content-type') ?? ''
      // Локальный vite-dev на неизвестный путь отдаёт index.html, а не 404,
      // поэтому ориентируемся на content-type, а не только на статус.
      if (!res.ok || !type.includes('application/json')) {
        setState(STATES.absent)
        setError(`HTTP ${res.status}, content-type: ${type || 'не указан'}`)
        return
      }
      setData(await res.json())
      setState(STATES.ok)
    } catch (e) {
      setState(STATES.fail)
      setError(e.message)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <section className="card">
      <h3>Прочитано на сервере при запросе</h3>
      <p className="muted small">
        Тот же деплой, но серверная часть: функция <code>/api/info</code> читает переменные в момент
        запроса. Ей чекбокс с системными переменными не нужен — она видит их всегда.
      </p>

      {state === STATES.loading && <p className="muted">Запрашиваю…</p>}

      {state === STATES.absent && (
        <p className="muted">
          Функция не отвечает JSON&apos;ом — похоже, это локальный запуск: <code>npm run dev</code>{' '}
          не поднимает папку <code>api/</code>. На Vercel здесь будут реальные значения.
          <br />
          <span className="small">{error}</span>
        </p>
      )}

      {state === STATES.fail && <p className="fail">Запрос не прошёл: {error}</p>}

      {state === STATES.ok && (
        <>
          <pre className="json">{JSON.stringify(data, null, 2)}</pre>
          <p className="muted small">
            <strong>На что смотреть.</strong> <code>region</code> — где физически выполнился запрос.{' '}
            <code>customGreeting</code> — переменная <code>MY_GREETING</code>, которую ты заводишь
            сам. Если задать ей разные значения для Preview и Production, здесь будет то, что
            положено этому окружению: так боевые секреты и разводят, чтобы preview ходил в тестовую
            базу, а не в продовую.
          </p>
        </>
      )}

      <button className="btn" onClick={load} disabled={state === STATES.loading}>
        Запросить ещё раз
      </button>
    </section>
  )
}
