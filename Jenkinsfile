#!/usr/bin/env groovy
node {
    
    stage('checkout') {
      checkout scm
    }

    stage('Information') {
      sh 'node -v'
      sh 'npm -v'     
    }    

    stage('Dependencies') {
      sh 'npm install'      
    }

    stage('Unit Test') {
      sh 'npm run unit'
    }
    
    stage('Build') {
      sh 'npm run build'
    }

    stage('Artifacts') {
        sh 'tar -czf dist.tar.gz ./dist'     
        archiveArtifacts artifacts: 'dist.tar.gz', fingerprint: true
    }    
  }

