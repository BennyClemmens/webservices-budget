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
