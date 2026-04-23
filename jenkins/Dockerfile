FROM jenkins/jenkins:lts

USER root

RUN apt-get update && apt-get install -y docker.io

USER jenkins

COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt
COPY casc.yaml /usr/share/jenkins/ref/casc.yaml

ENV CASC_JENKINS_CONFIG=/usr/share/jenkins/ref/casc.yaml
ENV JAVA_OPTS="-Dhudson.model.DirectoryBrowserSupport.CSP="