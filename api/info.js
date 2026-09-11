// Серверная функция. Её тоже деплоит каждый preview — отдельно от прода,
// со своим набором переменных окружения.
// Локально (npm run dev) её нет: Vite не запускает функции, будет 404.
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({
    env: process.env.VERCEL_ENV ?? null,
    branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
    sha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    url: process.env.VERCEL_URL ?? null,
    region: process.env.VERCEL_REGION ?? null,
    // Сюда удобно класть свою переменную из настроек проекта,
    // чтобы увидеть, что у Preview и Production значения разные.
    customGreeting: process.env.MY_GREETING ?? null,
    now: new Date().toISOString(),
  })
}
