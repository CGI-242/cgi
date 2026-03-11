FROM nginx:alpine

# Créer un utilisateur non-root pour Nginx (H1)
RUN addgroup -g 101 -S nginx 2>/dev/null || true && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx nginx 2>/dev/null || true && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx && \
    touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid

COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/
COPY dist/ /var/www/cgi242/
COPY normx-landing/ /var/www/normx-ai/

# Permissions pour l'utilisateur nginx
RUN chown -R nginx:nginx /var/www/cgi242 /var/www/normx-ai

USER nginx
