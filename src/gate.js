'use strict';

const { libs, runtime } = nodex;
const { http, error } = libs;
const { teamUrl, formUrl } = runtime.args.logic.gate;

exports.auth = async function(body) {
    const ret = await http.post({
        hostname: teamUrl.hostname,
        port: teamUrl.port,
        method: 'POST',
        path: '/get_user_by_token'
    }, body);
    const content = ret.content;
    console.log(content);
    if(content.result !== 'ok') {
        throw error(content.result, content.data);
    }
    return content.data;
};

exports.getUserById = async function(body) {
    const ret = await http.post({
        hostname: teamUrl.hostname,
        port: teamUrl.port,
        method: 'POST',
        path: '/get_user_by_id'
    }, body);
    const content = ret.content;
    console.log(content);
    if(content.result !== 'ok') {
        throw error(content.result, content.data);
    }
    return content.data;
};

exports.addTemplateForm = async function(body) {
    const ret = await http.post({
        hostname: formUrl.hostname,
        port: formUrl.port,
        method: 'POST',
        path: '/add_template'
    }, body);
    const content = ret.content;
    console.log(content);
    if(content.result !== 'ok') {
        throw error(content.result, content.data);
    }
    return content.data;
};

exports.getFormTemplateById = async function(body) {
    const ret = await http.post({
        hostname: formUrl.hostname,
        port: formUrl.port,
        method: 'POST',
        path: '/get_template_by_id'
    }, body);
    const content = ret.content;
    console.log(content);
    if(content.result !== 'ok') {
        throw error(content.result, content.data);
    }
    return content.data;
};

exports.setFormTemplateById = async function(body) {
    const ret = await http.post({
        hostname: formUrl.hostname,
        port: formUrl.port,
        method: 'POST',
        path: '/set_template_by_id'
    }, body);
    const content = ret.content;
    console.log(content);
    if(content.result !== 'ok') {
        throw error(content.result, content.data);
    }
    return content.data;
};

exports.addFormObject = async function(body) {
    const ret = await http.post({
        hostname: formUrl.hostname,
        port: formUrl.port,
        method: 'POST',
        path: '/add_object'
    }, body);
    const content = ret.content;
    console.log(content);
    if(content.result !== 'ok') {
        throw error(content.result, content.data);
    }
    return content.data;
};

exports.addFormObjectValues = async function(body) {
    const ret = await http.post({
        hostname: formUrl.hostname,
        port: formUrl.port,
        method: 'POST',
        path: '/add_object_values'
    }, body);
    const content = ret.content;
    console.log(content);
    if(content.result !== 'ok') {
        throw error(content.result, content.data);
    }
    return content.data;
};

exports.getObjectValuesById = async function(body) {
    const ret = await http.post({
        hostname: formUrl.hostname,
        port: formUrl.port,
        method: 'POST',
        path: '/get_object_values_by_id'
    }, body);
    const content = ret.content;
    console.log(content);
    if(content.result !== 'ok') {
        throw error(content.result, content.data);
    }
    return content.data;
};
