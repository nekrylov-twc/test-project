import { useState } from 'react'

// Обычный кусок интерфейса — чтобы было что ломать и чинить в ветках.
export default function Playground() {
  const [count, setCount] = useState(0)
  const [items, setItems] = useState(['Открыть preview с телефона', 'Позвать коллегу посмотреть'])
  const [draft, setDraft] = useState('')

  const add = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setItems((prev) => [...prev, text])
    setDraft('')
  }

  return (
    <section className="card">
      <h3>Песочница</h3>
      <p className="muted small">
        Живой кусок UI: меняй его в ветке и смотри, как правка доезжает до preview.
      </p>

      <div className="counter">
        <button className="btn" onClick={() => setCount((c) => c - 1)}>
          −
        </button>
        <span className="count">{count}</span>
        <button className="btn" onClick={() => setCount((c) => c + 1)}>
          +
        </button>
      </div>

      <form className="adder" onSubmit={add}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Что ещё проверить на preview"
          aria-label="Новый пункт"
        />
        <button className="btn primary" type="submit">
          Добавить
        </button>
      </form>

      <ul className="notes">
        {items.map((item, i) => (
          <li key={i}>
            {item}
            <button
              className="link"
              onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))}
              aria-label={`Удалить: ${item}`}
            >
              удалить
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
