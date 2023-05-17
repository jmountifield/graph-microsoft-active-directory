FROM node:14-alpine

ENV JUPITERONE_INTEGRATION_DIR=/opt/jupiterone/integration

COPY package.json yarn.lock tsconfig.json LICENSE ${JUPITERONE_INTEGRATION_DIR}/
COPY src/ ${JUPITERONE_INTEGRATION_DIR}/src

WORKDIR ${JUPITERONE_INTEGRATION_DIR}
RUN yarn install

ENTRYPOINT ["/usr/local/bin/yarn", "j1-integration", "run",  "-i", "${INTEGRATION_INSTANCE_ID}"]
