// Use withCredentials to securely load the .env file for the entire pipeline
withCredentials([file(credentialsId: 'jobtracker-env-file', variable: 'ENV_FILE')]) {
    pipeline {
        agent any

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
                    // Explicitly pass the path to the credentials file using --env-file
                    sh "docker compose --env-file \$ENV_FILE build --no-cache web"
                }
            }

            stage('Run Backend Tests') {
                steps {
                    echo '🧪 Running backend tests...'
                    sh "docker compose --env-file \$ENV_FILE up -d db"
                    sh "docker compose --env-file \$ENV_FILE run --rm web python manage.py test"
                }
            }

            stage('Deploy Application') {
                steps {
                    echo '🚀 Deploying new versions of all services...'
                    sh "docker compose --env-file \$ENV_FILE up -d --no-deps web frontend"
                }
            }
        }

        post {
            always {
                node('') {
                    echo '✅ Pipeline finished. Tearing down...'
                    // The teardown command also needs the credentials file to know which project to act on
                    sh "docker compose --env-file \$ENV_FILE down -v --remove-orphans || true"
                }
            }
        }
    }
}