### road map

- причесать README.md правил

remove-deprecated
patch-component-schema			remove-max-items
patch-endpoint-parameter-schema		remove-min-items
patch-endpoint-request-body-schema	remove-operation-id
patch-endpoint-response-schema		remove-parameter
patch-endpoint-schema			remove-unused-components

- разделить документацию на ru/en (доделать выбор языка)
- проверить ссылки из ошибок на github (якори проверить) и в message factory заменить их
- доработать скрипт генерации доки, чтобы выбранный язык не терялся

- доработать cli чтобы можно было так `cat foo.json | json2ts > foo.d.ts`
- override_policy append final ?
- примеры конфигов: сначала простой, потом супер сложный
- сделать descriptor (там где correction) ?
- можно получать diff yaml и постепенно матчить, через к примеру
  https://www.npmjs.com/package/yaml-diff-patch
