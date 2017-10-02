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
      }
    }
    stage('Docker Build') {
      steps {
        parallel(
          "Build Docker Image": {
            sh '''mkdir dockerbuild/
            mkdir dockerbuild/static/
cp -r build/* dockerbuild/static/
cp Dockerfile dockerbuild/Dockerfile
cp nginx.vh.default.conf dockerbuild/nginx.vh.default.conf
cd dockerbuild/
docker build -t firestarthehack/ioduino-frontend:latest ./'''
          },
          "Save Artifact": {
            sh 'zip -r static.zip dockerbuild/static/'
            archiveArtifacts(artifacts: 'static.zip', onlyIfSuccessful: true)
          }
        )
      }
    }
    stage('Publish Latest Image') {
      steps {
        sh 'docker push firestarthehack/ioduino-frontend:latest'
      }
    }
    stage('Deploy') {
      steps {
        rancher(environmentId: '1a5', confirm: true, image: 'firestarthehack/ioduino-frontend:latest', service: 'IODuino/frontend', endpoint: 'http://34.215.0.188:8080/v2-beta', credentialId: 'rancher-server')
      }
    }
  }
}
