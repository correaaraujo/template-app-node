import Server from "../src/application/server";
import "reflect-metadata"

const port = process.env.PORT;
Server.bootstrap().app.listen(port, () => {
    console.log(`Server Running on port ${port}!`)
})