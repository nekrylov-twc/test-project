// Vercel сам прокидывает системные переменные в сборку фронтенда,
// добавляя префикс фреймворка (для Vite — VITE_).
// Работает, если в настройках проекта включён тумблер
// "Automatically expose System Environment Variables".
const env = import.meta.env

const value = (v) => (v && String(v).trim() ? String(v) : null)

export const deploy = {
  // production | preview | development
  env: value(env.VITE_VERCEL_ENV) ?? (env.DEV ? 'development' : 'unknown'),
  branch: value(env.VITE_VERCEL_GIT_COMMIT_REF),
  sha: value(env.VITE_VERCEL_GIT_COMMIT_SHA),
  message: value(env.VITE_VERCEL_GIT_COMMIT_MESSAGE),
  author: value(env.VITE_VERCEL_GIT_COMMIT_AUTHOR_LOGIN),
  repo: value(env.VITE_VERCEL_GIT_REPO_SLUG),
  owner: value(env.VITE_VERCEL_GIT_REPO_OWNER),
  prId: value(env.VITE_VERCEL_GIT_PULL_REQUEST_ID),
  url: value(env.VITE_VERCEL_URL),
  branchUrl: value(env.VITE_VERCEL_BRANCH_URL),
  buildTime: __BUILD_TIME__,
  isVercel: Boolean(value(env.VITE_VERCEL_ENV)),
}

export const shortSha = deploy.sha ? deploy.sha.slice(0, 7) : null

export const commitUrl =
  deploy.owner && deploy.repo && deploy.sha
    ? `https://github.com/${deploy.owner}/${deploy.repo}/commit/${deploy.sha}`
    : null

export const ENV_STYLE = {
  production: { label: 'PRODUCTION', color: '#2fbf71', hint: 'Это боевой деплой ветки main.' },
  preview: { label: 'PREVIEW', color: '#f0883e', hint: 'Это временный деплой ветки или пул-реквеста.' },
  development: { label: 'LOCAL DEV', color: '#6ea8fe', hint: 'Локальный npm run dev, Vercel тут ни при чём.' },
  unknown: { label: 'UNKNOWN', color: '#8b949e', hint: 'Переменные Vercel не видны — проверь настройки проекта.' },
}
