## To deploy server on vanila machine (Ubuntu 16.04), follow the below steps ##

1. Using Docker:

    1. Install Docker:
        Run the following command to install docker:

			sudo apt-get update

			sudo apt-get install \
				apt-transport-https \
				ca-certificates \
				curl \
				software-properties-common

			curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
				Verify that you now have the key with the fingerprint 9DC8 5822 9FC7 DD38 854A E2D8 8D81 803C 0EBF CD88,
				by searching for the last 8 characters of the fingerprint.
			sudo apt-key fingerprint 0EBFCD88

			sudo add-apt-repository \
				"deb [arch=amd64] https://download.docker.com/linux/ubuntu \
				$(lsb_release -cs) \
				stable"

			sudo apt-get update

			sudo apt-get install docker-ce

					OR
	
		Follow below link for reference
			https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/

	2. Install Docker Compose:
	    Run the following command to install docker compose

			sudo curl -L https://github.com/docker/compose/releases/download/1.18.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

			sudo chmod +x /usr/local/bin/docker-compose

					OR

		Follow below link for reference
			https://docs.docker.com/compose/install/#install-compose

	3. Run server in docker by following command:

			-> Make sure that current directory is root of source code then run following commands:
			
			    sudo docker-compose build (To build docker image)
			    
			    sudo docker-compose up (To start docker)
			            OR
				sudo docker-compose up -d (To start docker in background mode)