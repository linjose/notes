# HackMD

## Install via docker
- ref https://docs.docker.com/compose/install/
- ref https://github.com/hackmdio/docker-hackmd
```
# install docker 
apt install docker.io
# docker-compose
sudo curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version

# install hackmd
git clone https://github.com/hackmdio/docker-hackmd.git
cd docker-hackmd
#修改一下docker-compose.yml(直接連到host的PG)
docker-compose up
#新增帳號密碼 tbc
```
## Install on Ubuntu 16.04 (Native)

> Warning: 此SOP未完成

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
        "db": {
            "username": "username",
            "password": "password",
            "database": "codimd",
            "host": "127.0.0.1",
            "port": "5432",
            "dialect": "postgres"
            }

```
4. Setup environment variables which will overwrite the configs
```console
NODE_ENV=production
DEBUG=false
```
5. Build front-end bundle by `npm run build` (use `npm run dev` if you are in development)
6. Modify the file named `.sequelizerc`, change the value of the variable `url` with your db connection string
   For example: `postgres://username:password@127.0.0.1:5432/codimd`
7. Run `node_modules/.bin/sequelize db:migrate`, this step will migrate your db to the latest schema
8. Run the server as you like (node, forever, pm2)
```console
forever start app.js 
```
