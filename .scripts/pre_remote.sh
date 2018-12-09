#!/bin/bash

cd /opt && \
  git init --bare identiform_api.git && \
  git clone identiform_api.git identiform_api

cp /root/.scripts/post-receive /opt/identiform_api.git/hooks
chmod ug+x /opt/identiform_api.git/hooks/post-receive
cp /root/.scripts/.env /opt/identiform_api
