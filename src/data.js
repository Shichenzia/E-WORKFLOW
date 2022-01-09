'use strict';

const { libs } = nodex;
const { mysql } = libs;


exports.init = async function (args) { 
  console.log('data init.');
  console.log('data init args:', args);
  await mysql.init(args.mysql);
};

exports.getAllClass = async function() {
    const sql = `
        SELECT
            *
        FROM
            t_class
    `;

    return await mysql.query(sql);
}

exports.addClass = async function({ id, className, ctime, mtime, createor}) {
    const sql = `
        INSERT INTO
            t_class
        VALUES(
            "${id}",
            "${className}",
            "${ctime}",
            "${mtime}",
            "${createor}"
        )
    `;

    return await mysql.query(sql);
}

exports.setClassById = async function({ id, className, mtime}) {
    const sql = `
        UPDATE
            t_class
        SET
            c_name = "${className}",
            c_mtime = "${mtime}"
        WHERE
            c_id = "${id}"
    `;

    return await mysql.query(sql);
}

exports.delClassById = async function({ id }) {
    const sql = `
        DELETE FROM
            t_class
        WHERE
            c_id = "${id}"
    `;

    return await mysql.query(sql);
}

exports.getAllprocess = async function() {
    const sql = `
        SELECT
            *
        FROM
            t_process_info
    `;

    return await mysql.query(sql);
}

exports.getProcessById = async function({ id }) {
    const sql = `
        SELECT
            *
        FROM
            t_process_info
        WHERE
            c_id = "${id}"
    `;

    return await mysql.query(sql);
}

exports.addProcessTmp = async function({
    id,
    approvalName,
    class_id,
    processConfigJson,
    formTemplate,
    ctime,
    mtime,
    createor,
    approverIcon,
    approvalDesc
}) {
    const sql = `
        INSERT INTO
            t_process_info
        VALUES(
            "${id}",
            "${approvalName}",
            "${class_id}",
            '${processConfigJson}',
            '${formTemplate}',
            "${ctime}",
            '${mtime}',
            '${createor}',
            '${approverIcon}',
            '${approvalDesc}'
        )
    `;

    return await mysql.query(sql);
}

exports.setProcessById = async function({
    id,
    approvalName,
    class_id,
    processConfigJson,
    mtime,
    approverIcon,
    approvalDesc
}) {
    const sql = `
        UPDATE
            t_process_info
        SET
            c_title = "${approvalName}",
            c_class_id = "${class_id}",
            processConfigJson = '${processConfigJson}',
            c_mtime = "${mtime}",
            c_process_icon = "${approverIcon}",
            c_desc = "${approvalDesc}"
        WHERE
            c_id = "${id}"
    `;

    return await mysql.query(sql);
}

exports.delProcessById = async function({ id }) {
    const sql = `
        DELETE FROM
            t_process_info
        WHERE
            c_id = "${id}"
    `;

    return await mysql.query(sql);
}

exports.addNodeInfos = async function(text) {
    const sql = `
        INSERT INTO
            t_node_info
        VALUES
            ${text}
    `;

    return await mysql.query(sql);
}

exports.delNodesInfo = async function({ processId }) {
    const sql = `
        DELETE FROM
            t_node_info
        WHERE
            c_process_id = "${processId}"
    `;

    return await mysql.query(sql);
}

exports.getAllNodeInfoByProcessId = async function({ processId }) {
    const sql = `
        SELECT
            *
        FROM
            t_node_info
        WHERE
            c_process_id = "${processId}"
    `;

    return await mysql.query(sql);
}

exports.addWorkOrder = async function({ 
    id,
    title,
    processId,
    objectId,
    ctime,
    mtime,
    creator,
    isEnd,
    state
 }) {
    const sql = `
        INSERT INTO
            t_work_order_info
            (
                c_id,
                c_title,
                c_process_id,
                c_object_id,
                c_ctime,
                c_mtime,
                c_creator,
                c_is_end,
                c_state
            )
        VALUES(
            '${id}',
            '${title}',
            '${processId}',
            '${objectId}',
            '${ctime}',
            '${mtime}',
            '${creator}',
            '${isEnd}',
            '${state}'
        )
    `;

    return await mysql.query(sql);
}


exports.getWorkOrderById = async function({ id }) {
    const sql = `
        SELECT
            *
        FROM
            t_work_order_info
        WHERE
            c_id = "${id}"
    `;

    return await mysql.query(sql);
}


exports.addCirculation = async function({ 
    id,
    workOrderId,
    nodeId,
    message,
    processor,
    time,
    result
 }) {
    const sql = `
        INSERT INTO
            t_circulation
            (
                c_id,
                c_work_order_id,
                c_node_id,
                c_message,
                c_processor,
                c_time,
                c_result
            )
        VALUES(
            '${id}',
            '${workOrderId}',
            '${nodeId}',
            '${message}',
            '${processor}',
            '${time}',
            '${result}'
        )
    `;

    return await mysql.query(sql);
}


exports.getNextNodeByfather = async function({ processId, father }) {
    const sql = `
        SELECT
            *
        FROM
            t_node_info
        WHERE
            c_process_id = "${processId}" and c_father_node = "${father}"
    `;

    return await mysql.query(sql);
}


exports.addUserToWork = async function({ 
    id,
    type,
    workOrderId,
    userId,
    nodeId
 }) {
    const sql = `
        INSERT INTO
            t_work_and_user
            (
                c_id,
                c_type,
                c_work_order_id,
                c_user_id,
                c_node_id
            )
        VALUES(
            '${id}',
            '${type}',
            '${workOrderId}',
            '${userId}',
            '${nodeId}'
        )
    `;

    return await mysql.query(sql);
}


exports.setWorkOrderById = async function({
    id,
    isEnd,
    state,
    mtime
}) {
    const sql = `
        UPDATE
            t_work_order_info
        SET
            c_mtime = "${mtime}",
            c_is_end = "${isEnd}",
            c_state = "${state}"
        WHERE
            c_id = "${id}"
    `;

    return await mysql.query(sql);
}

exports.getMyStartWorkOrderByUid = async function({ uid }) {
    const sql = `
        SELECT
            *
        FROM
            t_work_order_info
        WHERE
            c_creator = "${uid}"
    `;

    return await mysql.query(sql);
}

exports.getCopyMeWorkOrderByUid = async function({ uid }) {
    const sql = `
        SELECT
            w.*
        FROM
            t_work_order_info w, t_work_and_user wu
        WHERE
            wu.c_user_id = "${uid}" and wu.c_work_order_id = w.c_id and wu.c_type = "2"
    `;

    return await mysql.query(sql);
}

exports.getDoneWorkOrderByUid = async function({ uid }) {
    const sql = `
        SELECT
            w.*
        FROM
            t_work_order_info w, t_work_and_user wu
        WHERE
            wu.c_user_id = "${uid}" and wu.c_work_order_id = w.c_id and wu.c_type = "1" and wu.c_node_id != w.c_state
    `;

    return await mysql.query(sql);
}

exports.getWaitDoneWorkOrderByUid = async function({ uid }) {
    const sql = `
        SELECT
            w.*
        FROM
            t_work_order_info w, t_work_and_user wu
        WHERE
            wu.c_user_id = "${uid}" and wu.c_work_order_id = w.c_id and wu.c_type = "1" and wu.c_node_id = w.c_state
    `;

    return await mysql.query(sql);
}


exports.getCirculationListByWorkOrderId = async function({ workOrderId }) {
    const sql = `
        SELECT
            c.*, n.*
        FROM 
            t_circulation c, t_node_info n
        WHERE 
            c.c_work_order_id = "${workOrderId}" and c.c_node_id = n.c_id
        ORDER BY
            c.c_time ASC
    `;

    return await mysql.query(sql);
}

exports.checkUserApprovalPower = async function({ workOrderId, uid }) {
    const sql = `
        SELECT
            w.*
        FROM
            t_work_order_info w, t_work_and_user wu
        WHERE
                wu.c_user_id = "${uid}" 
            and
                wu.c_work_order_id = w.c_id
            and
                wu.c_type = "1" 
            and 
                wu.c_node_id = w.c_state
            and
                wu.c_work_order_id = '${workOrderId}'
    `;

    return await mysql.query(sql);
}
