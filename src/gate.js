'use strict';

const { libs, runtime } = nodex;
const { http, error } = libs;
const { teamUrl, formUrl, secret : { appid, secret } } = runtime.args.logic.gate;
const { sign } = require("./utils")

const httpPost = async (body, hostname, port, path) => {
    const $_appid = appid;
    const $_sign = sign({ ...body, $_appid}, secret);
    const ret = await http.post({
        hostname,
        port,
        method: 'POST',
        path
    }, 
    {
        ...body,
        $_appid,
        $_sign
    });
    const content = ret.content;
    console.log(content);
    if(content.result !== 'ok') {
        throw error(content.result, content.data);
    }
    return content.data;
}

exports.auth = async function(body) {
    return httpPost(body, teamUrl.hostname, teamUrl.port, '/get_user_by_token');
};

exports.getUserById = async function(body) {
    return httpPost(body, teamUrl.hostname, teamUrl.port, '/get_user_by_id');
};

exports.addTemplateForm = async function(body) {
    return httpPost(body, formUrl.hostname, formUrl.port, '/add_template');
};

exports.getFormTemplateById = async function(body) {
    return httpPost(body, formUrl.hostname, formUrl.port, '/get_template_by_id');
};

exports.setFormTemplateById = async function(body) {
    return httpPost(body, formUrl.hostname, formUrl.port, '/set_template_by_id');
};

exports.addFormObject = async function(body) {
    return httpPost(body, formUrl.hostname, formUrl.port, '/add_object');
};

exports.addFormObjectValues = async function(body) {
    return httpPost(body, formUrl.hostname, formUrl.port, '/add_object_values');
};

exports.getObjectValuesById = async function(body) {
    return httpPost(body, formUrl.hostname, formUrl.port, '/get_object_values_by_id');
};


// exports.auth = async function(body) {
//     return httpPost(body, teamUrl.hostname, teamUrl.port, '/api/E-TEAM/get_user_by_token');
// };

// exports.getUserById = async function(body) {
//     return httpPost(body, teamUrl.hostname, teamUrl.port, '/api/E-TEAM/get_user_by_id');
// };

// exports.addTemplateForm = async function(body) {
//     return httpPost(body, formUrl.hostname, formUrl.port, '/api/E-FROM/add_template');
// };

// exports.getFormTemplateById = async function(body) {
//     return httpPost(body, formUrl.hostname, formUrl.port, '/api/E-FROM/get_template_by_id');
// };

// exports.setFormTemplateById = async function(body) {
//     return httpPost(body, formUrl.hostname, formUrl.port, '/api/E-FROM/set_template_by_id');
// };

// exports.addFormObject = async function(body) {
//     return httpPost(body, formUrl.hostname, formUrl.port, '/api/E-FROM/add_object');
// };

// exports.addFormObjectValues = async function(body) {
//     return httpPost(body, formUrl.hostname, formUrl.port, '/api/E-FROM/add_object_values');
// };

// exports.getObjectValuesById = async function(body) {
//     return httpPost(body, formUrl.hostname, formUrl.port, '/api/E-FROM/get_object_values_by_id');
// };
