# NimaServer

https://nima-server.herokuapp.com/

[Nima](https://github.com/shinter61/Nima) のバックエンド側

## 環境構築

#### server setup

```
docker build -t node .
docker-compose up
```

`http://localhost:3000`で確認

#### DB setup

```
docker exec -it postgres sh
psql -U postgres -d postgres_db
```

postgresQL内に入った後に、以下のwikiのコマンドを実行

https://github.com/shinter61/NimaServer/wiki/User-table-DDL
