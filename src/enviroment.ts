import {EnvInterface} from "./Interface/EnvInterface";

const dev:EnvInterface = {
  basePath: "http://localhost:7474"
}

const productionEnvInterface = {
  basePath: ""
}


export function enviroment() {
    return dev;
}
