pipeline {
  agent any
  stages {
    stage('BeginProcess') {
      steps {
        sh 'rm -rf dockerbuild/'
      }
    }
    stage('Build') {
      agent {
        docker {
            image 'node:7.4'
        }
      }
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }
    stage('Docker Build') {
      steps {
        "Build Docker Image": {
          sh "mkdir dockerbuild/"
          sh "mkdir dockerbuild/static/"
          sh "cp -r build/* dockerbuild/static/"
          sh "cp Dockerfile dockerbuild/Dockerfile"
          sh "cp nginx.vh.default.conf dockerbuild/nginx.vh.default.conf"
          sh "docker build -t firestarthehack/ioduino-frontend:${BUILD_NUMBER} ./dockerbuild"
        }
      }
    }
    stage('Publish Latest Image') {
      steps {
        sh "docker login -u ${DOCKER_PRIVATE_USR} -p ${DOCKER_PRIVATE_PSW} ${PRIVATE_REGISTRY}"
        sh "docker push firestarthehack/ioduino-frontend:${BUILD_NUMBER}"
      }
    }
  }
}
