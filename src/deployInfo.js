// Vercel прокидывает свои системные переменные в сборку фронтенда,
// добавляя префикс фреймворка (для Vite — VITE_).
// Работает только если в проекте включён чекбокс
// Settings → Environment Variables → "Enable access to System Environment Variables".
const env = import.meta.env

const value = (v) => (v && String(v).trim() ? String(v) : null)

export const deploy = {
  // production | preview | development
  env: value(env.VITE_VERCEL_ENV) ?? (env.DEV ? 'development' : 'unknown'),
  targetEnv: value(env.VITE_VERCEL_TARGET_ENV),
  branch: value(env.VITE_VERCEL_GIT_COMMIT_REF),
  sha: value(env.VITE_VERCEL_GIT_COMMIT_SHA),
  message: value(env.VITE_VERCEL_GIT_COMMIT_MESSAGE),
  author: value(env.VITE_VERCEL_GIT_COMMIT_AUTHOR_LOGIN),
  repo: value(env.VITE_VERCEL_GIT_REPO_SLUG),
  owner: value(env.VITE_VERCEL_GIT_REPO_OWNER),
  prId: value(env.VITE_VERCEL_GIT_PULL_REQUEST_ID),
  // Адрес именно этого билда. Не меняется никогда.
  url: value(env.VITE_VERCEL_URL),
  // Адрес ветки. Всегда показывает её последний коммит.
  branchUrl: value(env.VITE_VERCEL_BRANCH_URL),
  // Адрес прода. Vercel отдаёт его даже внутри preview — поэтому
  // прямо отсюда можно открыть прод и сравнить.
  prodUrl: value(env.VITE_VERCEL_PROJECT_PRODUCTION_URL),
  buildTime: __BUILD_TIME__,
}

// Единственный надёжный признак, что системные переменные включены.
export const systemVarsOn = Boolean(value(env.VITE_VERCEL_ENV))
export const isLocal = !systemVarsOn && Boolean(env.DEV)

export const shortSha = deploy.sha ? deploy.sha.slice(0, 7) : null

export const commitUrl =
  deploy.owner && deploy.repo && deploy.sha
    ? `https://github.com/${deploy.owner}/${deploy.repo}/commit/${deploy.sha}`
    : null

export const ENV_STYLE = {
  production: {
    label: 'PRODUCTION',
    color: '#2fbf71',
    headline: 'Это боевая версия. Её видят все.',
    body: 'Сюда приезжает то, что смёржено в main. Пока PR не смёржен, здесь остаётся старый код — что бы ни происходило в ветках.',
  },
  preview: {
    label: 'PREVIEW',
    color: '#f0883e',
    headline: 'Это отдельная копия приложения, собранная из ветки.',
    body: 'У неё свой адрес, своя сборка и свои переменные окружения. На прод она не влияет никак — его можно открыть рядом и сравнить.',
  },
  development: {
    label: 'LOCAL DEV',
    color: '#6ea8fe',
    headline: 'Это локальный npm run dev.',
    body: 'Vercel тут ни при чём, поэтому почти все поля ниже пустые. Так и должно быть.',
  },
  unknown: {
    label: 'ПЕРЕМЕННЫЕ ВЫКЛЮЧЕНЫ',
    color: '#8b949e',
    headline: 'Приложение задеплоено, но не знает о себе ничего.',
    body: 'Vercel не отдал системные переменные в сборку. Включается одним чекбоксом — инструкция ниже.',
  },
}
