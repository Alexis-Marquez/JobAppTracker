FROM python:3.12-slim

# Set working directory
WORKDIR /code

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app source code
COPY . .

# Production command: Migrate then Start Gunicorn
# Using /bin/sh -c allows us to chain multiple commands in one line
CMD ["/bin/sh", "-c", "python manage.py migrate --noinput && gunicorn JobAppTracker.wsgi:application --bind 0.0.0.0:$PORT"]
