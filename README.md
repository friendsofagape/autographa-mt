# autographa-mt UI Production Deployment
A scripture machine translation system.

## Clone Repo
 - Clone the repo

## Install Dependencies
 - Install all dependencied by running the command `npm install` from the project directory.

## Create Build Folder
 - Create a build folder by running the command `npm run build` from within the project directory.

## Link files in /var/www/html/ folder.
 - Run Command to create sym link of the project directory or build folder file in `/var/www/html/` folder


## Nginx Configuration:
 - Copy and edit the files according to the project credentials and directories and save file as nginx.conf. You could use your custom name for the file.
 - For enabling ssl refer online documentation.

   ```
   server {
        root /var/www/html/autographa-mt/build;
        index index.html index.htm index.nginx-debian.html;

        server_name <server_name>;

        location / {
        try_files $uri $uri/ /index.html;
        }
    }
    ```

## Restart Nginx service
 - Run command `sudo systemctl restart nginx.service`
