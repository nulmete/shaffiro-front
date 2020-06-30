#!/usr/bin/env groovy
node {
    
    stage('checkout') {
        checkout scm
    }

    stage('Information') {
      steps {
        sh 'node -v'
        sh 'npm -v'
      }
    }    
    stage('Dependencies') {
      steps {
        sh 'npm install'
      }
    }
    stage('Unit Test') {
      steps {
        sh 'npm run unit'
      }
    }
    
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
    stage('Artifacts') {
      steps {
        sh 'tar -czf dist.tar.gz ./dist'
        
        archiveArtifacts artifacts: 'dist.tar.gz', fingerprint: true
      }
    }
    
    
  }

