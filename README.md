# Rabott

Rabott is a backend server for the Rabott Instagram discount bot. It handles the image generation, data retrieval, processing, and storage functionalities for the bot.

## Features

- Fetches discount data from the Edeka, Rewe & Lidl using Puppeteer.
- Stores discount items in a MongoDB database.
- Generates images to share in Instagram with the data from MongoDB.
- Uploads those images to Cloudinary.
- Shares these images in Instagram Graph API.


## API Endpoints

- `GET /scrap/:supermarket`: Scraps and stores discount items in MongoDB
- `GET /image-generator/generate`: Creates PNG files, uploads them to Cloudinary and shares in Instagram as a carousel post.

-`Also, there are two user endpoints that are deactivated because app is still under development. Normally, no more requests can be made without logging in and being authenticated.`

## Contributing

Contributions are welcome! If you'd like to contribute to the Rabott, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
