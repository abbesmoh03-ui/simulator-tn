@echo off
cd /d C:\Users\mohto\OneDrive\Bureau\faneldz\simulator-tn
call npx vercel deploy --prod --yes --scope 2-78d1 > deploy_log.txt 2>&1
