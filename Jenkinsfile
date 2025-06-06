pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "jobtracker_${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out code from Jenkins job configuration...'
                checkout scm
            }
        }

        stage('Build Containers') {
            steps {
                echo 'Building all service images...'
                sh 'docker-compose build'
            }
        }



        stage('Run Backend Tests') {
            steps {
                echo 'Running backend tests in a fresh container...'
                // Spin up the database first
                sh 'docker-compose up -d db'
                // Use 'run' for an isolated test environment
                sh 'docker-compose run --rm web python manage.py test'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished. Tearing down the full environment...'
            // The -v flag removes the database volume for a completely clean run next time
            sh 'docker-compose down -v'
        }
    }
}