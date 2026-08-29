pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
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

        stage('SonarCloud Analysis & Quality Gate') {
            steps {
                withSonarQubeEnv('sonarcloud') {
                    script {
                        def scannerHome = tool 'sonar-scanner'
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                              -Dsonar.organization=prajvalg2110-max \
                              -Dsonar.projectKey=prajvalg2110-max_First-project \
                              -Dsonar.sources=.
                              -Dsonar.tests=test \
                              -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                        """
                    }
                    script {
                        def ceTaskId = sh(script: "grep ceTaskId= .scannerwork/report-task.txt | cut -d'=' -f2", returnStdout: true).trim()
                        def status = ""
                        for (int i = 0; i < 30; i++) {
                            status = sh(script: "curl -s -u \${SONAR_AUTH_TOKEN}: \${SONAR_HOST_URL}/api/ce/task?id=${ceTaskId} | grep -o '\"status\":\"[A-Z]*\"' | head -1 | cut -d'\"' -f4", returnStdout: true).trim()
                            echo "SonarCloud task status: ${status}"
                            if (status == 'SUCCESS' || status == 'FAILED' || status == 'CANCELED') { break }
                            sleep 5
                        }
                        if (status != 'SUCCESS') {
                            error "SonarCloud analysis did not finish cleanly (status: ${status})"
                        }
                        def analysisId = sh(script: "curl -s -u \${SONAR_AUTH_TOKEN}: \${SONAR_HOST_URL}/api/ce/task?id=${ceTaskId} | grep -o '\"analysisId\":\"[^\"]*\"' | cut -d'\"' -f4", returnStdout: true).trim()
                        def qgStatus = sh(script: "curl -s -u \${SONAR_AUTH_TOKEN}: \${SONAR_HOST_URL}/api/qualitygates/project_status?analysisId=${analysisId} | grep -o '\"status\":\"[A-Z]*\"' | head -1 | cut -d'\"' -f4", returnStdout: true).trim()
                        echo "Quality gate status: ${qgStatus}"
                        if (qgStatus != 'OK') {
                            error "Quality gate failed (status: ${qgStatus}) — stopping pipeline"
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'All stages green: tests + SonarCloud quality gate passed.'
        }
        failure {
            echo 'Pipeline failed — check which stage above.'
        }
    }
}

