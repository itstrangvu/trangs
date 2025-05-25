#!/bin/bash

# Create notes directory if it doesn't exist
mkdir -p content/notes

# Copy all blog files to notes
cp -r content/blog/* content/notes/

# Update references in files
find content/notes -type f -name "*.md" -exec sed -i '' 's/blog/notes/g' {} \;

# Create notes.11tydata.js file
echo 'module.exports = {
	tags: [
		"notes"
	],
	"layout": "layouts/post.njk",
};' > content/notes/notes.11tydata.js

echo "Migration completed. Please verify your changes before committing." 