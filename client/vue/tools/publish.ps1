
$excPath = Split-Path -Parent $MyInvocation.MyCommand.Definition

$npmRoot = ($excPath + "\..\")

cd $npmRoot  | npm publish -registry http://repositories.dev.seensun.cn/repository/npm-hosted

cd ../../../../