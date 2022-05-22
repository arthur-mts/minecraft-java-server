# Minecraft Java Server
This project aims to facilitate the deployment and management of a cloud based Linux server for Minecraft Java Edition.

## AWS Resources
To host and expose our server I used a t2.medium AWS EC2 instance (with defaults Network and Security configs), exposing the 25565 TCP port.  

I don't pretend to leave the server up 24/7, me and my friends only play Minecraft on weekends and get and dedicated cloud machine to host Minecraft would be a waste of money. So, I used an **AWS Lambda Function** exposed by an **AWS API Gateway** to startup/shutdown the EC2 Instance.

## Minecraft Server
The easiest thing on this project was startup the Minecraft Server, due to this incredible [post](https://dev.to/julbrs/how-to-run-a-minecraft-server-on-aws-for-less-than-3-us-a-month-409p) on DEV by Julien Bras.  
Basically, I installed Java JRE and created a [systemd](https://pt.wikipedia.org/wiki/Systemd) service that runs thist [.jar](https://launcher.mojang.com/v1/objects/a16d67e5807f57fc4e550299cf20226194497dc2/server.jar) and do all the job for you.


## Discord integration
For simplicity reasons, I wanted to send the EC2 public IP to an Discord Channel.  
The best way I founded to do this was a [systemd](https://pt.wikipedia.org/wiki/Systemd) service that runs after the Minecraft Server startup.

## TODO
- Write a decent tutorial
- Create a discord command to startup the server
- Post on LinkedIn