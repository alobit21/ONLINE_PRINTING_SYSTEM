# ── Stage 1: builder ──────────────────────────────────────────────────────────
# Install dependencies in a separate stage so the final image stays small
FROM python:3.12-slim AS builder

WORKDIR /app

# Install system packages needed to compile some Python deps (psycopg2, cryptography, Pillow)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first (better layer caching — deps only rebuild when requirements.txt changes)
COPY requirements.txt .

# Install into a local directory we can copy to the final image
RUN pip install --upgrade pip \
    && pip install --prefix=/install --no-cache-dir -r requirements.txt


# ── Stage 2: final image ──────────────────────────────────────────────────────
FROM python:3.12-slim

WORKDIR /app

# Runtime system deps only (libpq for psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder stage
COPY --from=builder /install /usr/local

# Copy project source code
COPY . .

# Create directories for static and media files
RUN mkdir -p /app/staticfiles /app/media

# Collect static files (whitenoise will serve them)
# We set dummy env vars so settings.py doesn't crash during build
RUN SECRET_KEY=dummy-build-key \
    DEBUG=False \
    DB_NAME=dummy \
    python manage.py collectstatic --noinput

# Run as non-root user for security
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Expose the port gunicorn will bind to
EXPOSE 8000

# Start gunicorn — stationary_config.wsgi:application matches your wsgi.py
CMD ["gunicorn", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "3", \
     "--timeout", "120", \
     "--access-logfile", "-", \
     "--error-logfile", "-", \
     "stationary_config.wsgi:application"]