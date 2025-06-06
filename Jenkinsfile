pipeline {
    // Define an agent that has the Docker tools installed
    agent {
        docker {
            image 'docker:latest'
            args '-v /var/run/docker.sock:/var/run/docker.sock' // Still need the socket
        }
    }

    environment {
        COMPOSE_PROJECT_NAME = "jobtracker_${env.BUILD_NUMBER}"
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
                // Use 'docker compose' (no hyphen)
                sh "docker compose build --no-cache web"
            }
        }

        stage('Run Backend Tests') {
            steps {
                echo '🧪 Running backend tests...'
                sh "docker compose up -d db"
                // Use 'docker compose run'
                sh "docker compose run --rm web python manage.py test"
            }
        }

        stage('Deploy Backend') {
            steps {
                echo '🚀 Deploying new backend...'
                // Use 'docker compose up'
                sh "docker compose up -d --no-deps web"
            }
        }
    }

    post {
        always {
            echo '✅ Pipeline finished. Tearing down...'
            // Use 'docker compose down'
            sh "docker compose down -v --remove-orphans"
        }
    }
}