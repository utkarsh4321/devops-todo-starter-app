#!/bin/sh

# Start the generated config file
CONFIG_PATH="/frontend-app/mywebsite/env/env-config.js"
echo "window.env = {" > $CONFIG_PATH

# Find all environment variables starting with "VITE_" and add them to the file
for var in $(env | grep "VITE_"); do
  name=$(echo "$var" | cut -d "=" -f 1)
  value=$(echo "$var" | cut -d "=" -f 2-)
  echo "  $name: \"$value\"," >> $CONFIG_PATH
done

# End the config file
echo "};" >> $CONFIG_PATH
echo "Environment variable injection completed."
exec nginx -g 'daemon off;'