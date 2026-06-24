#!/bin/bash
set -e

echo "⏳ Aguardando banco de dados..."
sleep 3

echo "📦 Aplicando migrações..."
python manage.py migrate --noinput

echo "📂 Coletando arquivos estáticos..."
python manage.py collectstatic --noinput

echo "🚀 Iniciando servidor Gunicorn..."
exec gunicorn tcc_project.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 2 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
