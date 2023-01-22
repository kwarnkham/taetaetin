```
scp spa.zip root@facile.madewithheart.tech:/root/

cd /var/www/taetaetin && rm -r ./* && mv /root/spa.zip ./spa.zip && unzip spa.zip && rm spa.zip && mv spa/* ./ && rm -r spa

cd /var/www/maymay-client && rm -r ./* && mv /root/spa.zip ./spa.zip && unzip spa.zip && rm spa.zip && mv spa/* ./ && rm -r spa

systemctl restart nginx
```
