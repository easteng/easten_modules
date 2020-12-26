net use \\172.16.1.8\ipc$ 123.com /user:LIPAN-PC\administrator

xcopy ".\_site\*.*"                      "\\172.16.1.8\D$\wwwroot\module.dev.seensun.cn\web\"     /D /E /Y /H /K

net use \\172.16.1.8\ipc$ /delete

