pipeline {
    agent any // Now 'agent any' works because the agent has the required tools

    environment {
        // Using the build number ensures concurrent builds don't collide
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
                // Use 'docker compose' (no hyphen), which is the modern command
                sh "docker compose build --no-cache web"
            }
        }

        stage('Run Backend Tests') {
            steps {
                echo '🧪 Running backend tests...'
                sh "docker compose up -d db"
                sh "docker compose run --rm web python manage.py test"
            }
        }

        stage('Deploy Application') {
            steps {
                echo '🚀 Deploying new versions of all services...'
                sh "docker compose up -d --no-deps web frontend"
            }
        }
    }

    post {
        always {
            // This 'node' block provides the context needed to run shell commands
            node(''){
                echo '✅ Pipeline finished. Tearing down...'
                sh "docker compose down -v --remove-orphans"
            }
        }
    }
}