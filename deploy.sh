#!/bin/bash
staging_host="frontend_admin@s-dashboard.zenni.cn"
uat_host="frontend_admin@u-dashboard.zenni.cn"
prod_host="proServer"
project_path="/home/frontend_admin/www"
if [ "$1" == "uat" ]; then
  target_host="$uat_host"
elif [ "$1" == "staging" ]; then
  target_host="$staging_host"
else
  target_host="$prod_host"
  project_path="/var/www/html/web_other"
fi

function deploy() {
  current_version="$(date +%s)"
  echo "$target_host"
  target_path="$target_host:$project_path"
  echo "$target_path"
  scp -r mgr "$target_path/$current_version"
  echo "$target_path/$current_version"
  ssh "$target_host" "ln -nfsv $project_path/$current_version $project_path/mgr"
  echo "deploy to $target_path"
}

function setup() {
  current_version="$(date +%s)"
  target_path="$target_host:$project_path"
  ssh "$target_host" "cp -r $project_path/mgr $project_path/$current_version"
  ssh "$target_host" "mv $project_path/mgr $project_path/mgr_bak ; ln -nfsv $project_path/$current_version $project_path/mgr"
  echo "setup to $target_path"
}


if [ "$2" == "setup" ]; then
  setup $@
else
  deploy $@
fi
