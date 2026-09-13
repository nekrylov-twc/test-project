import { deploy, shortSha } from './deployInfo.js'

// Три адреса, которые Vercel держит одновременно. Разница между ними —
// половина всего механизма preview-деплоев.
const rows = [
  {
    key: 'url',
    title: 'Адрес этого билда',
    hint: 'Навсегда закреплён за одним коммитом. Даже когда в ветку приедут новые коммиты, по этой ссылке останется ровно то, что ты видишь сейчас. Такую ссылку не стыдно кинуть в чат.',
  },
  {
    key: 'branchUrl',
    title: 'Адрес ветки',
    hint: 'Всегда показывает последний коммит ветки. Запушил ещё раз — по этой ссылке уже новая версия, ссылка та же. Её удобно держать открытой во время работы над PR.',
  },
  {
    key: 'prodUrl',
    title: 'Адрес прода',
    hint: 'Vercel отдаёт его даже внутри preview. Открой рядом — и увидишь ровно ту разницу, которую принесёт мёрж PR.',
  },
]

export default function Addresses() {
  const known = rows.filter((r) => deploy[r.key])
  if (!known.length) return null

  const isHere = (key) =>
    deploy[key] && deploy.url && deploy[key] === deploy.url ? ' (ты сейчас здесь)' : ''

  return (
    <section className="card">
      <h3>Три адреса одного приложения</h3>
      <p className="muted small">
        Главное, ради чего затевались preview-деплои: сравнить «как есть» и «как будет», не трогая
        прод.
      </p>
      {known.map((r) => (
        <div className="addr" key={r.key}>
          <div className="addr-head">
            <strong>{r.title}</strong>
            <span className="muted small">{isHere(r.key)}</span>
          </div>
          <a href={`https://${deploy[r.key]}`} target="_blank" rel="noreferrer">
            {deploy[r.key]}
          </a>
          <p className="muted small">{r.hint}</p>
        </div>
      ))}
      {deploy.prodUrl && deploy.env === 'preview' && (
        <a className="btn primary wide" href={`https://${deploy.prodUrl}`} target="_blank" rel="noreferrer">
          Открыть прод в соседней вкладке и сравнить
          {shortSha ? ` (здесь — ${shortSha})` : ''}
        </a>
      )}
    </section>
  )
}
