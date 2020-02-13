@echo off
:loop
node ./bot.js
echo restarting bot in 5 seconds...
sleep 5
goto :loop