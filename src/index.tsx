import express from 'express';
import cors from 'cors';
import  setUpApiRoutes  from './controller/controller';

const app = express();
const port = 8001;

app.use(cors());

// Pass the app instance to the main API file to set up routes
setUpApiRoutes(app);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
