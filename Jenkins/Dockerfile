FROM jenkins/jenkins:lts
USER root
RUN curl -sL https://deb.nodesource.com/setup_15.x | bash -; \
apt-get install -y nodejs; \
npm install -g npm
USER jenkins