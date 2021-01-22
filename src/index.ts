import app from './app';

let server = null;
server = app.listen(3000, async () => {
  console.log('Listening on port 3000');
});
