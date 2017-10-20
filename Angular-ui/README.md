# Описание на проекта

# Как е създаден този проект

Като за начало, този проект е базиран на Angular 4. Цялата структура е
автоматично генерирана от Angular CLI използвайки следните команди:

```sh
# За инсталация на самият Angular CLI
npm install @angular/cli
# За генериране на самият проект
./node_modules/@angular/cli/bin/ng new package-track-ui --skip-git --skip-tests --skip-commit --routing --directory .
# За обновяване на използваните компоненти
npm update --save
# За генериране на deviewView страницата
./node_modules/@angular/cli/bin/ng generate component deviceView
```

# Как да работим с Angular CLI

## Тестов сървър

Използвайте `./node_modules/@angular/cli/bin/ng serve` за нов тестов сървър. Отворете в браузъра `http://localhost:4200/`. Всяка промяна на файловете, ще бъде автоматично отразена в браузъра.

## Генериране на нови компоненти

Използвайте `./node_modules/@angular/cli/bin/ng generate component component-name` за генериране на нов компонент. Други налични опции са `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Билдване

Проекта се компилира с `./node_modules/@angular/cli/bin/ng build`. След компилацията файловете ще бъдата достъпни в `dist/` директорият. Използването на  `-prod` флаг, указва да се ползват оптимизирани настройки.


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
