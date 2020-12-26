$excPath = Split-Path -Parent $MyInvocation.MyCommand.Definition

$npmRoot = ($excPath + "\..\")

cd $npmRoot  | yarn add snweb-icon@latest snweb-component@latest snweb-module@latest sn-cesium-x@latest sn-cesium@latest

cd ../../../../