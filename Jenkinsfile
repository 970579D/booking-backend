pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Check Node.js') {
            steps {
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Verify project') {
            steps {
                sh 'cat package.json'
                sh 'ls -la'
            }
        }

        stage('Start application') {
            steps {
                sh 'npm run start'
            }
        }
    }
}