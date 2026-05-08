pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                // Normalde git checkout yapılır:
                // git 'https://github.com/elifguluyr/ReadMe_Project.git'
                checkout scm
            }
        }
        
        stage('Build Backend Image') {
            steps {
                echo 'Building backend Docker image...'
                // sh 'docker-compose build backend' 
            }
        }
        
        stage('Build Frontend Image') {
            steps {
                echo 'Building frontend Docker image...'
                // sh 'docker-compose build frontend'
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests...'
                // Örnek test adımı
                // sh 'npm test'
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                // sh 'docker-compose up -d'
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed.'
        }
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
