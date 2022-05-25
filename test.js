const axios = require("axios");
const FormData = require("form-data")

const axiosClient = axios.create({
    baseURL: "http://localhost:4567",
    headers: {
        key: "test123",
    },
});

const sendCommand = (command) => {


    return new Promise((res, rej) => {
        axiosClient
            .post("/v1/server/exec", d)
            .then(res)
            .catch(console.log);
    });
};

sendCommand("help")