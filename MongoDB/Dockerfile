FROM mongo

RUN mkdir -p /usr/NodeJS/MongoDB
WORKDIR /usr/NodeJS/MongoDB
COPY . /usr/NodeJS/MongoDB
RUN chmod +x /usr/NodeJS/MongoDB/run.sh
RUN chmod +x /usr/NodeJS/MongoDB/user.sh

# Environment Variables
ENV AUTH yes

CMD ["./run.sh"]