node {
    checkout scm
	stage('Build') {
		docker.build('node:9').inside{
			sh 'npm install'
			sh 'npm run build'
		}
	}
	stage('Prep Image') {
		sh "mkdir dockerbuild/"
		sh "mkdir dockerbuild/static/"
		sh "cd build/;ls"
		sh "cd build/static/;ls"
		sh "cp -r build/* dockerbuild/static/"
		sh "cp Dockerfile dockerbuild/Dockerfile"
		sh "cp nginx.vh.default.conf dockerbuild/nginx.vh.default.conf"
	}
	stage('Build Docker and Publish') {
		sh "docker login -u ${DOCKER_PRIVATE_USR} -p ${DOCKER_PRIVATE_PSW} ${PRIVATE_REGISTRY}"
		def builtImage = docker.build("firestarthehack/ioduino-frontend:${BUILD_NUMBER}", "./dockerbuild")
		builtImage.push()
		builtImage.push('latest')
	}
}
