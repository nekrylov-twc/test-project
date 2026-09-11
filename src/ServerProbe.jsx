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
      <h3>Что видит серверная функция</h3>
      <p className="muted small">
        Ответ <code>/api/info</code> — те же переменные, но уже на рантайме. Локально функции нет,
        поэтому здесь будет заглушка: это нормально.
      </p>

      {state === STATES.loading && <p className="muted">Запрашиваю…</p>}

      {state === STATES.absent && (
        <p className="muted">
          Функция не отвечает JSON&apos;ом — похоже, это локальный запуск. На Vercel здесь появятся
          реальные значения.
          <br />
          <span className="small">{error}</span>
        </p>
      )}

      {state === STATES.fail && <p className="fail">Запрос не прошёл: {error}</p>}

      {state === STATES.ok && <pre className="json">{JSON.stringify(data, null, 2)}</pre>}

      <button className="btn" onClick={load} disabled={state === STATES.loading}>
        Запросить ещё раз
      </button>
    </section>
  )
}
