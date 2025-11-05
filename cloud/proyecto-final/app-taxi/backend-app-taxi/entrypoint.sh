#!/usr/bin/env sh
set -eu

MODE="${APPLICATION_MODE}"
echo ">> Starting mode=${MODE} NODE_ENV=${NODE_ENV} TZ=${TZ}"

# Esperar a Postgres si está configurado
if [ -n "${DB_HOST}" ]; then
  echo ">> Waiting for DB ${DB_HOST}:${DB_PORT} ..."
  # Requiere netcat (lo instalamos en la imagen)
  until nc -z "${DB_HOST}" "${DB_PORT}"; do
    sleep 1
  done
fi

if [ "$MODE" = "http" ]; then
  echo ">> Running DB migrations"
  node dist/core/cli/run-migrations.js
  echo ">> Migrations OK"
  node dist/core/cli/run-seeders.js
  echo ">> Seeders OK"
  echo ">> Http OK"
  exec node dist/main.js
else
  echo ">> Starting non-HTTP mode (${MODE})…"
  exec node dist/main.js
fi
