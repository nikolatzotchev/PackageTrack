# Описание на проекта

# Как е създаден този проект

Като за начало, този проект е базиран на Angular 4. Цялата структура е
автоматично генерирана от Angular CLI използвайки следните команди:

```sh
npm install @angular/cli
./node_modules/.bin/ng new ui --routing --skip-test --skip-git --skip-commit --minimal
cd ui
./node_modules/.bin/ng generate component header -is false -it false --export
./node_modules/.bin/ng generate component devices -is false -it false --export
./node_modules/.bin/ng generate component trips -is false -it false --export
./node_modules/.bin/ng generate component report -is false -it false --export
./node_modules/.bin/ng generate component trips/trips-view -is false -it false -flat --export
npm install primeng --save-prod
npm install font-awesome --save-prod

cat <<EOF >src/styles.css
@import url('../node_modules/font-awesome/css/font-awesome.min.css');
@import url('../node_modules/primeng/resources/themes/omega/theme.css');
@import url('../node_modules/primeng/resources/primeng.min.css');
EOF

# Optionally if you want to generate swagger API (need to have the server running)
#curl -o swagger.json http://localhost:8080/v2/api-docs
#docker run --rm -v ${PWD}:/local swaggerapi/swagger-codegen-cli generate \
#     --remove-operation-id-prefix
#    -i /local/swagger.json \
#    -l typescript-angular \
#    -o /local/src/app/swagger

# Setup production / development profiles
sed -ie '/production: false/a\
, baseUrl: "http://localhost:8080/api/v1/"
' src/environments/environment.ts

sed -ie '/production: true/a\
, baseUrl: "/api/v1/"
' src/environments/environment.prod.ts

```

# Как да работим с Angular CLI

## Тестов сървър

Използвайте `./node_modules/.bin/ng serve` за нов тестов сървър. Отворете в браузъра `http://localhost:4200/`. Всяка промяна на файловете, ще бъде автоматично отразена в браузъра.

## Билдване

Проекта се компилира с `./node_modules/.bin/ng build`. След компилацията файловете ще бъдата достъпни в `dist/` директорият. Използването на  `-prod` флаг, указва да се ползват оптимизирани настройки.


# Използвани компоненти

1. PrimeNG (https://www.primefaces.org/primeng/)

# Контейнеризация на проекта
Проекта е готов за работа в cloud-a. За целта има добавена поддръжка за създаване на Docker Image.

За да се направи този image локално може да се ползва следната команда:

```
docker build -t package-track-ui .
```

Следната команда ще пусне създаденият image:

```
docker run -it --rm -p 3456:80 --add-host REMOTE_API_HOST:10.254.18.11 package-track-ui
```

В детаили - командата се очаква да пусне web server на порт 3456, така че за да отворите визуалният интерфейс се налага да ползвате http://localhost:3456/.

Освен това се очаква приложението да праща REST заявки към REMOTE_API_HOST, който трябва да се зададе още по време на стартиране на машината. Реално всяка една заявка към /api ще бъде проксирана от nginx към този REMOTE_API_HOST.
