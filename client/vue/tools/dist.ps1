
$excPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$npmRoot = ($excPath + "\..\")

# 切换到 modules 项目根目录
cd $npmRoot


# 更新版本
$commonPath = "../../../../tools/common.json"
$packagePath = "package.json"

$common = (Get-Content $commonPath -Raw) | ConvertFrom-Json 
$version =  $common.version

$package = (Get-Content $packagePath -Raw) | ConvertFrom-Json 
$package.version = $version
$package | ConvertTo-Json -depth 4| Set-Content -Path $packagePath

# # 编译
yarn dist


# # 返回根目录
cd ../../../../