GAZVA ADMIN IMAGE UPLOAD UPDATE

This update adds local image upload support to the Admin Panel for Member and Event forms.

Files to replace in your existing project:
- public/admin/admin.js
- public/admin/admin.css
- server/server.js
- server/package.json
- server/routes/uploads.js (new file)

How it works:
1. Admin clicks Choose Image.
2. Select an image from the PC.
3. The image is uploaded to public/uploads/ by the Node/Express server.
4. The returned /uploads/... URL is saved into image_url.
5. Admin can alternatively paste an existing image URL.
6. A preview is shown before saving.

Limits:
- JPG, JPEG, PNG, WEBP, GIF, AVIF
- Maximum 5 MB

After replacing the files, open PowerShell in the server folder and run:

npm install
npm start

Then open:
http://localhost:4000/admin/
