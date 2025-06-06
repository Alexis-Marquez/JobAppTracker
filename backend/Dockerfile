FROM python:3.12-slim

# Set working directory
WORKDIR /code

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app source code
COPY . .

# Default command to run migrations & start server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
