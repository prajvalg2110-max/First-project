// STEP 1 of the pipeline: just checkout + install + unit tests.
// We'll add SonarQube, Docker, Trivy, ECR and K8s stages one at a time
// after this one is green in Jenkins.

pipeline {
    agent any

    tools {
        nodejs 'node20'   // set this name up in Manage Jenkins > Tools (see notes)
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('.') {
                    sh 'npm ci'
                }
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    junit testResults: 'reports/junit.xml', allowEmptyResults: true
                    archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
                }
            }
        }
    }

    post {
        success {
            echo 'Step 1 green: checkout + install + unit tests all passed.'
        }
        failure {
            echo 'Something failed — check the stage logs above.'
        }
    }
}

