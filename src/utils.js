const md5 = require('js-md5');

/**
 * 对http请求数据签名，内部采用MD5算法生成签名指纹。
 * @param {object} data 用于签名的http请求数据。
 * @param {string} secret 用于签名的密钥。
 * @returns {string} 签名指纹
 */
exports.sign = function sign(data, secret) {
  const str = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("&");

  return md5(str + secret);
}

