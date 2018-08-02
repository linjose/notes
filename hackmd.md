# HackMD

## Install on Ubuntu 16.04 (Native)

### Prerequisite
- Node.js 8.x 
```console
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_8.x 74 | sudo -E bash -
sudo apt-get install -y nodejs
```
- Database (PostgreSQL) use charset `utf8`
```console
sudo add-apt-repository 'deb http://apt.postgresql.org/pub/repos/apt/ xenial-pgdg main'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | \
  sudo apt-key add -
sudo apt-get update
sudo apt-get install postgres-10
```
- npm (and its dependencies, especially [uWebSockets](https://github.com/uWebSockets/uWebSockets#nodejs-developers), [node-gyp](https://github.com/nodejs/node-gyp#installation))
```console
npm install gyp
npm install uws
```
- For **building** CodiMD we recommend to use a machine with at least **2GB** RAM



### Instructions

1. Download a release and unzip or clone into a directory
```console
wget https://github.com/hackmdio/codimd/archive/master.zip -O codimd.zip
unzip codimd.zip
```
2. Enter the directory and type `bin/setup`, which will install npm dependencies and create configs. The setup script is written in Bash, you would need bash as a prerequisite.
```console
cd codimd-master/
bin/setup
```
3. Setup the configs, see more below
```console
```
4. Setup environment variables which will overwrite the configs
```console
```
5. Build front-end bundle by `npm run build` (use `npm run dev` if you are in development)
```console
```
6. Modify the file named `.sequelizerc`, change the value of the variable `url` with your db connection string
   For example: `postgres://username:password@localhost:5432/codimd`
```console
```
7. Run `node_modules/.bin/sequelize db:migrate`, this step will migrate your db to the latest schema
```console
```
8. Run the server as you like (node, forever, pm2)
```console
```
