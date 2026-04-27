import 'dotenv/config';
import { createApp } from './app';

const port = Number(process.env.PORT || 4100);
const app = createApp();
app.listen(port, () => {
  console.log(`Sky Radiant Agro API running on ${port}`);
});
