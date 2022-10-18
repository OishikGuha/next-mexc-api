const axios = require("axios");
const { Console, timeStamp } = require("console");

const removeEmptyValue = (obj) => {
  if (!(obj instanceof Object)) return {};
  Object.keys(obj).forEach((key) => isEmptyValue(obj[key]) && delete obj[key]);
  return obj;
};

const isEmptyValue = (input) => {
  return (
    (!input && input !== false && input !== 0) ||
    ((typeof input === "string" || input instanceof String) &&
      /^\s+$/.test(input)) ||
    (input instanceof Object && !Object.keys(input).length) ||
    (Array.isArray(input) && !input.length)
  );
};

const buildQueryString = (params) => {
  if (!params) return "";
  return Object.entries(params).map(stringifyKeyValuePair).join("&");
};

const CreateRequest = async (config) => {
  const { baseURL, method, url, params, apiKey, timestamp, Signature } = config;
  if (method === "GET" || method === "DELETE") {
    const request = getRequestInstance({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        ApiKey: apiKey,
        "Request-Time": timestamp,
        Signature: Signature,
      },
    }).request({
      method,
      url,
      params
    });
    return (await request).data;
  }
  if (method === "POST") {
    const request = getRequestInstance({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        ApiKey: apiKey,
        "Request-Time": timestamp,
        Signature: Signature,
      },
    }).request({
      method,
      url,
      data: params,
    });
    return (await request).data;
  }
};

const stringifyKeyValuePair = ([key, value]) => {
  const valueString = Array.isArray(value) ? `["${value.join('","')}"]` : value;
  return `${key}=${encodeURIComponent(valueString)}`;
};

const getRequestInstance = (config) => {
  return axios.create({
    ...config,
  });
};

const createRequest = async (config) => {
  const { baseURL, apiKey, method, url } = config;
  const request = getRequestInstance({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      "X-MEXC-APIKEY": apiKey,
    },
  }).request({
    method,
    url,
  });
  return (await request).data;
};

const pubRequest = async (config) => {
  const { apiKey, method, url } = config;
  const request = getRequestInstance({
    baseURL: "https://www.mexc.com",
    headers: {
      "Content-Type": "application/json",
      "X-MEXC-APIKEY": apiKey,
    },
  }).request({
    method,
    url,
  });
  return (await request).data;
};

const flowRight =
  (...functions) =>
  (input) =>
    functions.reduceRight((input, fn) => fn(input), input);

const defaultLogger = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
});

module.exports = {
  isEmptyValue,
  removeEmptyValue,
  buildQueryString,
  createRequest,
  flowRight,
  CreateRequest,
  pubRequest,
  defaultLogger,
};
