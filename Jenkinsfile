pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "jobtracker_${env.BUILD_NUMBER}"
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
                sh 'docker compose --env-file ' + env.ENV_FILE + ' build'
            }
        }

        stage('Run Backend Tests') {
            steps {
                echo '🧪 Running backend tests...'
                sh 'docker compose --env-file ' + env.ENV_FILE + ' up -d db'
                // This will now work because it uses the code inside the image
                sh 'docker compose --env-file ' + env.ENV_FILE + ' run --rm web python manage.py test'
            }
        }

        stage('Deploy Application') {
            steps {
                echo '🚀 Deploying new versions of all services...'
                sh 'docker compose --env-file ' + env.ENV_FILE + ' up -d --no-deps web frontend'
            }
        }
    }

    post {
        always {
            node('') {
                echo '✅ Pipeline finished. Tearing down...'
                sh 'docker compose --env-file ' + env.ENV_HLE + ' down -v --remove-orphans || true'
            }
        }
    }
}