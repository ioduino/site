pipeline {
  agent any
  stages {
    stage('BeginProcess') {
      steps {
        sh 'rm -rf dockerbuild/'
      }
    }
    stage('Build') {
      steps {
        sh 'npm install'
        sh 'npm run build'
		sh 'zip -r static.zip dockerbuild/static/'
        archiveArtifacts(artifacts: 'static.zip', onlyIfSuccessful: true)
      }
    }
    stage('Docker Build') {
      steps {
	    sh "mkdir dockerbuild/"
        sh "mkdir dockerbuild/static/"
        sh "cd build/;ls"
        sh "cd build/static/;ls"
        sh "cp -r build/* dockerbuild/static/"
        sh "cp Dockerfile dockerbuild/Dockerfile"
        sh "cp nginx.vh.default.conf dockerbuild/nginx.vh.default.conf"
        sh "cd dockerbuild;docker build -t firestarthehack/ioduino-frontend:${BUILD_NUMBER} ./"
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
