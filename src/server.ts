import app from "./app";

app.listen(process.env.PORT, () => {
  console.log(`Server is up and listening on port ${process.env.PORT} ...`);
});
