# Правила eslint-config-airbnb-base (локальная копия)

Файлы `*.js` в этой папке — копия `rules/*.js` из пакета
[eslint-config-airbnb-base@15.0.0](https://www.npmjs.com/package/eslint-config-airbnb-base)
(лицензия MIT, см. `LICENSE.md`). Пакет не развивается (последнее изменение кода — июль 2022)
и поддерживает только ESLint 7–8, поэтому правила перенесены в репозиторий и подключаются
напрямую из `eslint.config.js`. Набор и параметры правил сохранены без изменений.

## Локальные изменения относительно оригинала

- Удалены ключи формата eslintrc (`env`, `parserOptions`, `plugins`, `settings`);
  их аналоги для flat config заданы в `eslint.config.js`.
- Правила форматирования, объявленные устаревшими в ядре ESLint, переименованы в `@stylistic/*`
  (пакет [@stylistic/eslint-plugin](https://eslint.style)). Параметры не менялись;
  единственное правило, сменившее имя: `func-call-spacing` → `@stylistic/function-call-spacing`.
- Правила `import/*` переименованы в `import-x/*`
  (пакет [eslint-plugin-import-x](https://github.com/un-ts/eslint-plugin-import-x),
  поддерживаемый форк eslint-plugin-import).
- `function-paren-newline`: условие по версии ESLint заменено результатом для ESLint >= 6
  (`'multiline-arguments'`), зависимость от `semver` убрана.
- `no-unused-vars`: добавлен параметр `caughtErrors: 'none'`. В ESLint 9 значение по умолчанию
  изменилось на `'all'`; параметр сохраняет прежнее поведение.
- Ссылки в комментариях ведут на документацию @stylistic и import-x.

## Устаревшие правила ядра, которые пока оставлены

ESLint 10 всё ещё содержит эти правила, но они помечены как deprecated и могут быть удалены
в следующей мажорной версии. Замены на этот случай:

| Правило | Замена |
| --- | --- |
| `global-require`, `no-new-require`, `no-path-concat`, `no-buffer-constructor` | eslint-plugin-n: `n/global-require`, `n/no-new-require`, `n/no-path-concat`, `n/no-deprecated-api` |
| `no-new-object` | `no-object-constructor` (ядро ESLint) |
| `no-new-symbol` | `no-new-native-nonconstructor` (ядро ESLint) |
| `no-spaced-func` | `@stylistic/function-call-spacing` (уже включено) |
| `lines-around-directive` | `@stylistic/padding-line-between-statements` |
| `no-return-await` | замены нет, правило можно отключить |
