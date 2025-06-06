pipeline {
    agent any

    environment {
        // Using the build number ensures concurrent builds don't collide
        COMPOSE_PROJECT_NAME = "jobtracker_${env.BUILD_NUMBER}"

        // Load the secret file credential into an environment variable named ENV_FILE
        // The variable will contain the temporary path to your .env file
        ENV_FILE = credentials('jobtracker-env-file')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Services') {
            steps {
                echo '🐳 Building services...'
                // Use the environment variable in your shell command
                sh "docker compose --env-file ${env.ENV_FILE} build --no-cache web"
            }
        }

        stage('Run Backend Tests') {
            steps {
                echo '🧪 Running backend tests...'
                sh "docker compose --env-file ${env.ENV_FILE} up -d db"
                sh "docker compose --env-file ${env.ENV_FILE} run --rm web python manage.py test"
            }
        }

        stage('Deploy Application') {
            steps {
                echo '🚀 Deploying new versions of all services...'
                sh "docker compose --env-file ${env.ENV_FILE} up -d --no-deps web frontend"
            }
        }
    }

    post {
        always {
            node('') {
                echo '✅ Pipeline finished. Tearing down...'
                // The teardown command also needs the credentials file
                sh "docker compose --env-file ${env.ENV_FILE} down -v --remove-orphans || true"
            }
        }
    }
}