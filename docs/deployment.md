# FitRecord 部署文档

本文档以 Ubuntu/Debian VPS 为例，部署方式为：

```text
Caddy 或直接 IP 访问
  -> Node.js 运行 SvelteKit
  -> SQLite 文件存储数据
```

## 1. 推送代码

在本地项目目录执行：

```sh
cd /Users/Zhuanz/Desktop/Code/FitRecord
git push origin main
```

## 2. 登录服务器

```sh
ssh root@你的服务器 IP
```

以下命令默认以 `root` 用户执行。

## 3. 安装基础环境

```sh
apt update
apt install -y curl git build-essential openssl
```

安装 Node.js 22：

```sh
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node -v
npm -v
```

## 4. 拉取并构建项目

```sh
mkdir -p /opt/apps
cd /opt/apps
git clone https://github.com/ch7x/FitRecord.git
cd FitRecord

npm ci
npm run build
```

如果服务器已经存在项目，更新时使用：

```sh
cd /opt/apps/FitRecord
git pull
npm ci
npm run build
```

## 5. 配置生产环境变量

生成 session secret：

```sh
openssl rand -hex 32
```

创建环境文件：

```sh
nano /opt/apps/FitRecord/.env.production
```

写入：

```env
NODE_ENV=production
PORT=3000
HOST=127.0.0.1
FITRECORD_DB_PATH=/opt/apps/FitRecord/data/fitrecord.db
FITRECORD_PASSWORD=替换成你访问网站时使用的密码
FITRECORD_SESSION_SECRET=替换成 openssl 生成的随机字符串
```

说明：

- `FITRECORD_PASSWORD` 设置后，网站会启用密码访问。
- `FITRECORD_DB_PATH` 是 SQLite 数据库文件路径。
- `data/fitrecord.db` 是最重要的数据文件，记得备份。

## 6. 配置 systemd 服务

创建服务文件：

```sh
nano /etc/systemd/system/fitrecord.service
```

写入：

```ini
[Unit]
Description=FitRecord
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/apps/FitRecord
EnvironmentFile=/opt/apps/FitRecord/.env.production
ExecStart=/usr/bin/node build/index.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

启动服务：

```sh
systemctl daemon-reload
systemctl enable fitrecord
systemctl start fitrecord
systemctl status fitrecord
```

查看日志：

```sh
journalctl -u fitrecord -f
```

本机测试：

```sh
curl http://127.0.0.1:3000
```

## 7. 访问方式 A：直接开放端口

如果你想先通过 IP 和端口访问：

```text
http://你的服务器 IP:3000
```

需要在服务器防火墙或云厂商安全组中放开 `3000` 端口。

这种方式简单，但不推荐长期使用。长期使用建议走 Caddy 或 Nginx 反向代理。

## 8. 访问方式 B：Caddy 反向代理

安装 Caddy：

```sh
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/gpg.key | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt > /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install -y caddy
```

如果暂时没有域名，使用 IP 的 80 端口：

```sh
nano /etc/caddy/Caddyfile
```

写入：

```caddy
:80 {
	reverse_proxy 127.0.0.1:3000
}
```

重载 Caddy：

```sh
systemctl reload caddy
```

访问：

```text
http://你的服务器 IP
```

如果有域名并已解析到服务器：

```caddy
你的域名 {
	reverse_proxy 127.0.0.1:3000
}
```

Caddy 会自动申请 HTTPS 证书。

## 9. 更新部署

以后更新代码：

```sh
cd /opt/apps/FitRecord
git pull
npm ci
npm run build
systemctl restart fitrecord
systemctl status fitrecord
```

## 10. 备份数据

SQLite 数据库默认在：

```text
/opt/apps/FitRecord/data/fitrecord.db
```

手动备份：

```sh
mkdir -p /opt/backups/fitrecord
cp /opt/apps/FitRecord/data/fitrecord.db /opt/backups/fitrecord/fitrecord-$(date +%F).db
```

下载到本地：

```sh
scp root@你的服务器 IP:/opt/apps/FitRecord/data/fitrecord.db ./fitrecord.db
```

## 11. 安全建议

- 部署后尽快修改 root 密码。
- 长期使用建议改成 SSH key 登录。
- 关闭不需要的端口。
- 一定设置 `FITRECORD_PASSWORD`，不要让网站裸奔在公网。
- 定期备份 `fitrecord.db`。

