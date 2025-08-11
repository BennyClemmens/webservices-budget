# webservices-budget

## 0. Setting up the repository

```bash
benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES
$ git clone https://github.com/BennyClemmens/webservices-budget.git
Cloning into 'webservices-budget'...
warning: You appear to have cloned an empty repository.

benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES
$ cd webservices-budget

benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ git remote -v
origin  https://github.com/BennyClemmens/webservices-budget.git (fetch)
origin  https://github.com/BennyClemmens/webservices-budget.git (push)

benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ echo "# webservices-budget" >> README.md

benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ git add README.md
warning: in the working copy of 'README.md', LF will be replaced by CRLF the next time Git touches it

benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ git commit -m 'initial commit with obligatoy README.md'
[main (root-commit) 09ed259] initial commit with obligatoy README.md
 1 file changed, 1 insertion(+)
 create mode 100644 README.md

benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ git push
info: please complete authentication in your browser...
Enumerating objects: 3, done.
Counting objects: 100% (3/3), done.
Writing objects: 100% (3/3), 265 bytes | 265.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
To https://github.com/BennyClemmens/webservices-budget.git
 * [new branch]      main -> main

benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
```

And then commiting this chapter, thus concluding the repo stuff (where the basic settings were allready set).

## 2. REST API intro

### Koa

Basic config trough yarn init

```bash
benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ ls -al
total 8
drwxr-xr-x 1 benny 197609    0 Aug  8 23:35 ./
drwxr-xr-x 1 benny 197609    0 Aug  8 23:34 ../
drwxr-xr-x 1 benny 197609    0 Aug  8 23:43 .git/
-rw-r--r-- 1 benny 197609 1763 Aug  8 23:42 README.md

benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ yarn init --yes --private
! Corepack is about to download https://repo.yarnpkg.com/4.6.0/packages/yarnpkg-cli/bin/yarn.js
? Do you want to continue? [Y/n] y

➤ YN0000: · Yarn 4.6.0
➤ YN0000: ┌ Resolution step
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in 0s 51ms

benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ ls -al
total 445
drwxr-xr-x 1 benny 197609      0 Aug  8 23:54 ./
drwxr-xr-x 1 benny 197609      0 Aug  8 23:34 ../
-rw-r--r-- 1 benny 197609    134 Aug  8 23:54 .editorconfig
drwxr-xr-x 1 benny 197609      0 Aug  8 23:48 .git/
-rw-r--r-- 1 benny 197609    142 Aug  8 23:54 .gitattributes
-rw-r--r-- 1 benny 197609    333 Aug  8 23:54 .gitignore
-rwxr-xr-x 1 benny 197609 434498 Aug  8 23:54 .pnp.cjs*
drwxr-xr-x 1 benny 197609      0 Aug  8 23:54 .yarn/
-rw-r--r-- 1 benny 197609   1763 Aug  8 23:42 README.md
-rw-r--r-- 1 benny 197609     93 Aug  8 23:54 package.json
-rw-r--r-- 1 benny 197609    332 Aug  8 23:54 yarn.lock
```
Some tweaks

```bash
benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ yarn set version berry
➤ YN0000: Done in 0s 3ms

benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ git rm yarn.lock
rm 'yarn.lock'

benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ rm .pnp.cjs

benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ echo "nodeLinker: node-modules" > .yarnrc.yml

benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ yarn add koa
! Corepack is about to download https://repo.yarnpkg.com/4.9.2/packages/yarnpkg-cli/bin/yarn.js
? Do you want to continue? [Y/n] y

➤ YN0000: · Yarn 4.9.2
➤ YN0000: ┌ Resolution step
➤ YN0085: │ + koa@npm:3.0.1, accepts@npm:1.3.8, content-disposition@npm:0.5.4, content-type@npm:1.0.5, cookies@npm:0.9.1, deep-equal@npm:1.0.1, delegates@npm:1.0.0, depd@npm:1.1.2, depd@npm:2.0.0, and 28 more.
➤ YN0000: └ Completed in 0s 303ms
➤ YN0000: ┌ Fetch step
➤ YN0013: │ 7 packages were added to the project (+ 361.34 KiB).
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in 0s 574ms
```

Configured package.json, .gitignore and made a firsdt index.js

### Middlewares

Note: yarn install did an auto refactoring of package.json

To understand middelwares: understand Promises

### Typescript

```bash
benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ yarn add --dev typescript tsx @types/node
➤ YN0000: · Yarn 4.9.2
➤ YN0000: ┌ Resolution step
➤ YN0085: │ + @types/node@npm:24.2.1, tsx@npm:4.20.3, typescript@patch:typescript@npm%3A5.9.2#optional!builtin<compat/typescript>::version=5.9.2&hash=5786d5, @esbuild/aix-ppc64@npm:0.25.8, and 122 more.
➤ YN0000: └ Completed in 1s 626ms
➤ YN0000: ┌ Fetch step
➤ YN0013: │ 43 packages were added to the project (+ 62.85 MiB).
➤ YN0000: └ Completed in 1s 67ms
➤ YN0000: ┌ Link step
➤ YN0007: │ esbuild@npm:0.25.8 must be built because it never has been before or the last one failed
➤ YN0000: └ Completed in 0s 454ms
➤ YN0000: · Done in 3s 166ms
```

Refactored index.js => index.ts with modern import style

```bash
benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ yarn add --dev @types/koa
➤ YN0000: · Yarn 4.9.2
➤ YN0000: ┌ Resolution step
➤ YN0085: │ + @types/koa@npm:3.0.0, @types/accepts@npm:1.3.7, @types/body-parser@npm:1.19.6, @types/connect@npm:3.4.38, @types/content-disposition@npm:0.5.9, @types/cookies@npm:0.9.1, and 11 more.
➤ YN0000: └ Completed in 0s 483ms
➤ YN0000: ┌ Fetch step
➤ YN0013: │ 11 packages were added to the project (+ 148.91 KiB).
➤ YN0000: └ Completed in 0s 644ms
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in 1s 226ms
```

```bash
benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ yarn tsc --init

Created a new tsconfig.json
                                                                                                                     TS
You can learn more at https://aka.ms/tsconfig
```

Took the version from the course ...

Add a build alias in yarn for tsc

```bash
benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ yarn build
```

Add watch functionallity and refactoring

### Debugging

Added a debugger (in package.json)

### Logger

```bash
benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ yarn add winston
➤ YN0000: · Yarn 4.9.2
➤ YN0000: ┌ Resolution step
➤ YN0085: │ + winston@npm:3.17.0, @colors/colors@npm:1.6.0, @dabh/diagnostics@npm:2.0.3, @types/triple-beam@npm:1.3.5, async@npm:3.2.6, color-convert@npm:1.9.3, color-name@npm:1.1.3, and 20 more.
➤ YN0000: └ Completed in 0s 494ms
➤ YN0000: ┌ Fetch step
➤ YN0013: │ 3 packages were added to the project (+ 445.47 KiB).
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in 0s 832ms
```

### Linting

```bash
benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ yarn add --dev eslint @eslint/js typescript-eslint @stylistic/eslint-plugin
➤ YN0000: · Yarn 4.9.2
➤ YN0000: ┌ Resolution step
➤ YN0085: │ + @eslint/js@npm:9.33.0, @stylistic/eslint-plugin@npm:5.2.3, eslint@npm:9.33.0, typescript-eslint@npm:8.39.0, @eslint-community/eslint-utils@npm:4.7.0, and 99 more.
➤ YN0000: └ Completed in 1s 187ms
➤ YN0000: ┌ Fetch step
➤ YN0013: │ 38 packages were added to the project (+ 11.09 MiB).
➤ YN0000: └ Completed in 0s 402ms
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed in 0s 627ms
➤ YN0000: · Done in 2s 253ms
```
Let's see ...

```bash
benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ yarn lint

D:\DATA\GIT\WEBSERVICES\webservices-budget\build\index.js
   5:23  error  'exports' is not defined                 no-undef
   6:31  error  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
   6:31  error  'require' is not defined                 no-undef
   9:5   error  'console' is not defined                 no-undef
  11:5   error  'console' is not defined                 no-undef

D:\DATA\GIT\WEBSERVICES\webservices-budget\src\index.ts
  2:27  error  Strings must use singlequote  @stylistic/quotes

✖ 6 problems (6 errors, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.
```

Fixed some with an ignore build in config

```bash
benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ yarn lint --fix

D:\DATA\GIT\WEBSERVICES\webservices-budget\build\index.js
   5:23  error  'exports' is not defined                 no-undef
   6:31  error  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
   6:31  error  'require' is not defined                 no-undef
   9:5   error  'console' is not defined                 no-undef
  11:5   error  'console' is not defined                 no-undef

✖ 5 problems (5 errors, 0 warnings)


benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ yarn lint
```

In een eerdere poging moest de versie van ts nog lager worden gezet, hier is die fout verdwenen, check with own project!

## 3. REST API bouwen

```bash
benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ yarn add config
➤ YN0000: · Yarn 4.9.2
➤ YN0000: ┌ Resolution step
➤ YN0085: │ + config@npm:4.1.0, json5@npm:2.2.3
➤ YN0000: └ Completed in 0s 398ms
➤ YN0000: ┌ Fetch step
➤ YN0013: │ A package was added to the project (+ 114.19 KiB).
➤ YN0000: └ Completed in 0s 404ms
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in 1s 52ms

benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ yarn add --dev @types/config
➤ YN0000: · Yarn 4.9.2
➤ YN0000: ┌ Resolution step
➤ YN0085: │ + @types/config@npm:3.3.5
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in 0s 533ms
```

.env toegevoegd in root van project met inhoud NODE_ENV=production/development maar niet in git te zien, dus toe te voegen aan instructies.

config/development.ts en config/production.ts aangemaakt en gebruikt in core/logging.ts

### CRUD operaties

We maken even een eigen router in index.ts, die we dan straks wat professioneler via koa-router gaan implementeren.

### Router

```bash
benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ yarn add @koa/router koa-bodyparser
➤ YN0000: · Yarn 4.9.2
➤ YN0000: ┌ Resolution step
➤ YN0085: │ + @koa/router@npm:14.0.0, @types/koa-bodyparser@npm:4.3.12, koa-bodyparser@npm:4.4.1, @hapi/bourne@npm:3.0.0, bytes@npm:3.1.2, call-bind-apply-helpers@npm:1.0.2, call-bound@npm:1.0.4, and 26 more.
➤ YN0000: └ Completed in 0s 987ms
➤ YN0000: ┌ Fetch step
➤ YN0013: │ 18 packages were added to the project (+ 742.53 KiB).
➤ YN0000: └ Completed in 0s 421ms
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed in 0s 328ms
➤ YN0000: · Done in 1s 817ms

benny@FLAB2025 MINGW64 /D/DATA/GIT/WEBSERVICES/webservices-budget (main)
$ yarn add --dev @types/koa__router @types/koa-bodyparser
➤ YN0000: · Yarn 4.9.2
➤ YN0000: ┌ Resolution step
➤ YN0085: │ + @types/koa__router@npm:12.0.4
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed in 0s 234ms
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in 0s 617ms
```

And some manual code in app.use to check how the .body of a request is parsed

Added code to use a koa-router object to handle routes

### Mappenstructuur

#### Datalaag

src/data/mock_data.ts met een kleine aanpssing (USERS ook toegevoegd)

### Servicelaag

in src/service/transaction.service.ts enkele aanpassingen (userId), ook om linting happy te maken

in src/index.ts de service gebruikt om de body (als json object, niet als array) terug te gevens

### POST

post implementend (with userId), for now with type errors
