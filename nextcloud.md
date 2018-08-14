# NextCloud

- OS: ubuntu 16.04
- Ref: https://hub.docker.com/_/nextcloud/

### Install via docker
```
# install docker
curl -sSL https://get.docker.com/ | sh
service docker start

# pull & run nextcloud
docker pull nextcloud
docker run --name nc -d -p 8080:80 nextcloud
```
- visit: http://localhost:8080/

```
# settings

```
