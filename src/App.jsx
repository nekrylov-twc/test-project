import { useEffect, useState } from 'react'
import { MARKER } from './marker.js'
import { deploy, shortSha, commitUrl, ENV_STYLE } from './deployInfo.js'
import ServerProbe from './ServerProbe.jsx'
import Checklist from './Checklist.jsx'
import Playground from './Playground.jsx'

const fmt = (iso) => {
  try {
    return new Date(iso).toLocaleString('ru-RU', { dateStyle: 'medium', timeStyle: 'medium' })
  } catch {
    return iso
  }
}

function Row({ label, children }) {
  return (
    <div className="row">
      <span className="row-label">{label}</span>
      <span className="row-value">{children ?? <em className="muted">нет данных</em>}</span>
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
        <div className="badge" title={style.hint}>
          {style.label}
        </div>
      </header>

      <section className="card marker">
        <h2 style={{ color: 'var(--accent)' }}>{MARKER.title}</h2>
        <p>{MARKER.note}</p>
        <code className="path">меняется в src/marker.js</code>
      </section>

      <div className="grid">
        <section className="card">
          <h3>Что видит сборка фронтенда</h3>
          <p className="muted small">
            Переменные <code>VITE_VERCEL_*</code> вшиваются в бандл в момент билда. Если тут пусто —
            включи в настройках проекта «Automatically expose System Environment Variables».
          </p>
          <Row label="Окружение">{deploy.env}</Row>
          <Row label="Ветка">{deploy.branch}</Row>
          <Row label="Коммит">
            {shortSha ? (
              commitUrl ? (
                <a href={commitUrl} target="_blank" rel="noreferrer">
                  {shortSha}
                </a>
              ) : (
                shortSha
              )
            ) : null}
          </Row>
          <Row label="Сообщение">{deploy.message}</Row>
          <Row label="Автор">{deploy.author}</Row>
          <Row label="Pull request">{deploy.prId ? `#${deploy.prId}` : null}</Row>
          <Row label="URL деплоя">{deploy.url}</Row>
          <Row label="URL ветки">{deploy.branchUrl}</Row>
          <Row label="Время сборки">{fmt(deploy.buildTime)}</Row>
        </section>

        <ServerProbe />
      </div>

      <Checklist />
      <Playground />

      <footer className="muted small">
        Сборка от {fmt(deploy.buildTime)} · {deploy.isVercel ? 'запущено на Vercel' : 'запущено локально'}
      </footer>
    </div>
  )
}
