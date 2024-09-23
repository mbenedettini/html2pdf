```bash
#!/bin/bash

# HTML content to be converted (escaped for JSON)
HTML_CONTENT="<html><body><h1>Test PDF</h1><p>This is a test PDF generated from HTML.</p></body></html>"

# Create a temporary file for the form data
TEMP_FILE=$(mktemp)

# Write the HTML content to the temporary file
echo -n "$HTML_CONTENT" > "$TEMP_FILE"

# Send POST request and save the response as test.pdf
curl -v -X POST \
  -H "Authorization: 1234567890" \
  -H "Content-Type: multipart/form-data" \
  -F "html=@$TEMP_FILE" \
  --output test.pdf \
  http://localhost:8080/html2pdf

# Remove the temporary file
rm "$TEMP_FILE"

echo "PDF saved as test.pdf"
```

```bash
#!/bin/bash

# Define the URL of the endpoint
URL="http://localhost:8080/html2pdf:json"

# Define the JSON data to be sent
JSON_DATA='{
  "value": "<html><body><h1>Hello, World!</h1></body></html>"
}'

# Send a POST request with the JSON data
curl -X POST $URL \
     -H "Content-Type: application/json" \
     -d "$JSON_DATA" \
     -o output.pdf

# Check if the request was successful
if [ $? -eq 0 ]; then
  echo "PDF saved to output.pdf"
else
  echo "Failed to generate PDF"
fi
```
