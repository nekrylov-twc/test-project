import { useEffect } from 'react'
import { MARKER } from './marker.js'
import { deploy, shortSha, commitUrl, systemVarsOn, isLocal, ENV_STYLE } from './deployInfo.js'
import SetupHint from './SetupHint.jsx'
import Addresses from './Addresses.jsx'
import ServerProbe from './ServerProbe.jsx'
import Checklist from './Checklist.jsx'

const fmt = (iso) => {
  try {
    return new Date(iso).toLocaleString('ru-RU', { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}

const ago = (iso) => {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (!Number.isFinite(min) || min < 0) return null
  if (min < 1) return 'только что'
  if (min < 60) return `${min} мин назад`
  const h = Math.round(min / 60)
  if (h < 24) return `${h} ч назад`
  return `${Math.round(h / 24)} дн назад`
}

function Row({ label, children }) {
  return (
    <div className="row">
      <span className="row-label">{label}</span>
      <span className="row-value">{children ?? <em className="muted">пусто</em>}</span>
    </div>
  )
}

export default function App() {
  const style = ENV_STYLE[deploy.env] ?? ENV_STYLE.unknown

  useEffect(() => {
    document.documentElement.style.setProperty('--env', style.color)
    document.documentElement.style.setProperty('--accent', MARKER.accent)
  }, [style.color])

  return (
    <div className="page">
      <header className="head">
        <div>
          <h1>Preview Deploy Lab</h1>
          <p className="muted">Стенд, чтобы руками потрогать preview-деплои Vercel</p>
        </div>
        <div className="badge">{style.label}</div>
      </header>

      {/* Главный ответ на вопрос «что я вообще сейчас вижу». */}
      <section className="card hero">
        <h2>{style.headline}</h2>
        <p>{style.body}</p>
        {systemVarsOn && (
          <p className="facts">
            Ветка <strong>{deploy.branch ?? '—'}</strong>
            {shortSha && (
              <>
                , коммит{' '}
                {commitUrl ? (
                  <a href={commitUrl} target="_blank" rel="noreferrer">
                    <strong>{shortSha}</strong>
                  </a>
                ) : (
                  <strong>{shortSha}</strong>
                )}
              </>
            )}
            {deploy.prId && (
              <>
                , из пул-реквеста <strong>#{deploy.prId}</strong>
              </>
            )}
            . Собрано {ago(deploy.buildTime) ?? fmt(deploy.buildTime)}.
          </p>
        )}
      </section>

      {!systemVarsOn && !isLocal && <SetupHint />}

      {/* Маркер — то, что меняешь в ветке, чтобы увидеть разницу глазами. */}
      <section className="card marker">
        <h2 style={{ color: 'var(--accent)' }}>{MARKER.title}</h2>
        <p>{MARKER.note}</p>
        <p className="muted small">
          Это единственное место, которое надо трогать в эксперименте: заголовок, текст и цвет
          полосы слева. Меняешь в ветке — на preview новый маркер, на проде прежний.{' '}
          <code>src/marker.js</code>
        </p>
      </section>

      <Addresses />

      <div className="grid">
        <section className="card">
          <h3>Вшито в бандл при сборке</h3>
          <p className="muted small">
            Эти значения попали в JS-файл в момент сборки и больше не изменятся. Поэтому смена
            переменной в настройках Vercel требует передеплоя — иначе на странице останется старое.
          </p>
          <Row label="Окружение">{deploy.env}</Row>
          {deploy.targetEnv && deploy.targetEnv !== deploy.env && (
            <Row label="Кастомное окружение">{deploy.targetEnv}</Row>
          )}
          <Row label="Ветка">{deploy.branch}</Row>
          <Row label="Коммит">{shortSha}</Row>
          <Row label="Сообщение">{deploy.message}</Row>
          <Row label="Автор">{deploy.author}</Row>
          <Row label="Pull request">{deploy.prId ? `#${deploy.prId}` : null}</Row>
          <Row label="Время сборки">{fmt(deploy.buildTime)}</Row>
        </section>

        <ServerProbe />
      </div>

      <Checklist />

      <footer className="muted small">
        Сборка от {fmt(deploy.buildTime)} · {systemVarsOn ? 'запущено на Vercel' : 'запущено локально'}
      </footer>
    </div>
  )
}
