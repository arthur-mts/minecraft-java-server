import requests
import os
import subprocess

def send_discord_message(payload):
    auth_token = os.environ["AUTH_TOKEN"]
    headers = {'authorization': f"Bot {auth_token}", 'Content-Type': 'application/json'}
    channel_id = os.environ["DISCORD_CHANNEL_ID"]
    url = f"https://discord.com/api/v9/channels/{channel_id}/messages"

    response = requests.post(url, json=payload, headers=headers)

    return response.json()

get_ip_command = "curl http://checkip.amazonaws.com"
ip = subprocess.getoutput(get_ip_command)

send_discord_message(
    {
        "content": f"Link do servidor do Mine:\n {ip}:25565"
    }
)
