'use strict';

const { libs, runtime } = nodex;
const { data } = runtime;
const { fmt, flakes, error } = libs;

const gate = require('./gate');

const idCreate = flakes.create();

/**
 * 对日期格式进行处理 xxxx-xx-xx xx:xx
 * @param {Date} date 日期
 * @returns {string} 出理后的日期
 */
 function formatDate(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = date.getDate();
    d = d < 10 ? "0" + d : d;
    var h = date.getHours();
    h = h < 10 ? "0" + h : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? "0" + minute : minute;
    var second = date.getSeconds();
    second = second < 10 ? "0" + second : second;
    return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
}

exports.init = async function (args) { 
    console.log('logic init.');
    console.log('logic init args:', args);
    log.init({
        scope: "form",
        server: {
          url: "https://leansocket.tech/api/easegram-logs/add_logs",
          appid: "000ecbd765e60000000b",
          secret: "b132821b38fe460fed55a8743291429c",
          interval: 6000
        },
        handler: ()=>{}
    });
};

exports.helloWorld = async function () {
    return 'hello world!';
};

exports.getAllClass = async function(){
    return await data.getAllClass();
}

exports.addClass = async function({ className }){
    fmt.required(className, 'word', 1);

    const id = idCreate.get();
    const ctime = formatDate(new Date());
    const mtime = formatDate(new Date());
    await data.addClass({ id, className, ctime, mtime, createor: 'df'})
    return true;
}

exports.setClassById = async function({ id, className }){
    fmt.required(id, 'string', 1, 64);
    fmt.required(className, 'word', 1);

    const mtime = formatDate(new Date());
    await data.setClassById({ id, className, mtime,})
    return true;
}

exports.delClassById = async function({ id }){
    fmt.required(id, 'string', 1, 64);

    await data.delClassById({ id })
    return true;
}

// 获取所有流程模板
exports.getAllprocess = async function(){
    return await data.getAllprocess();
}

// 根据Id获取流程模板
exports.getProcessById = async function({ id }){
    fmt.required(id, 'string', 1, 64);
    const res = await data.getProcessById({id});

    if(res.length === 0) {
        return {};
    }

    let result = res[0];
    const formTemplateId = result.c_template_id;

    const ret= await gate.getFormTemplateById({ id: formTemplateId});
    const { FcDesignerRuleJson, FcDesignerOptionsJson } = ret[0];
    result = { ...result, FcDesignerRuleJson, FcDesignerOptionsJson};
    return result;
}

/**
 * 添加流程审批模板
 * @param {*} param0 
 */
exports.addProcessTmp = async function(param) {
    const { approverIcon, approvalName, approvalDesc, classify, starter, FcDesignerRuleJson, FcDesignerOptionsJson, processConfigJson, createor  } = param;

    fmt.required(approverIcon, "string", 1);
    fmt.required(approvalName, "string", 1);
    fmt.required(approvalDesc, "string", 1);
    fmt.required(classify, "string", 1);
    fmt.required(starter, "string", 1);
    fmt.required(FcDesignerRuleJson, "string", 1);
    fmt.required(FcDesignerOptionsJson, "string", 1);
    fmt.required(FcDesignerRuleJson, "string", 1);
    fmt.required(processConfigJson, "string", 1);
    fmt.required(createor, "string", 1, 64);


    // 网关请求form模块
    const formTemplate = await gate.addTemplateForm({
        name: approvalName,
        creator_id: createor,
        FcDesignerRuleJson,
        FcDesignerOptionsJson,
        class_id: classify
    });
    const processId = idCreate.get();

    // console.log(formTemplate);

    const processConfig = JSON.parse(processConfigJson);

    const nodeList = getChildNode(processConfig.nodeConfig);
    console.log(nodeList);
    let nodeTextList = nodeList.map((item, index) => {
        const {
            id,
            nodeName,
            type,
            settype,
            ccSelfSelectFlag,
            conditionNodes,
            conditionList,
            nodeUserList
        } = item;
        const c_child_node = index === nodeList.length - 1 ? "" : nodeList[index + 1].id;
        const c_father_node = index === 0 ? "" : nodeList[index - 1].id;

        return `("${id}", "${nodeName}", "${type}", "${settype}", '${nodeUserList}', "${ccSelfSelectFlag}", "${c_child_node}", "${c_father_node}", "${conditionNodes}", "${conditionList}", "${processId}")`;
    })

    await data.addNodeInfos(nodeTextList.join(','));


    await data.addProcessTmp({
        id: processId,
        approvalName,
        class_id: classify,
        processConfigJson,
        formTemplate,
        ctime: formatDate(new Date()),
        mtime: formatDate(new Date()),
        createor: createor,
        approverIcon,
        approvalDesc
    });

    return true;
}

/**
 * 根据id修改流程审批模板
 * @param {*} param0 
 */
 exports.setProcessById = async function(param) {
    const { id, approverIcon, approvalName, approvalDesc, classify, starter, FcDesignerRuleJson, FcDesignerOptionsJson, processConfigJson } = param;

    fmt.required(id, "string", 1, 255);
    fmt.required(approverIcon, "string", 1);
    fmt.required(approvalName, "string", 1);
    fmt.required(approvalDesc, "string", 1);
    fmt.required(classify, "string", 1);
    fmt.required(starter, "string", 1);
    fmt.required(FcDesignerRuleJson, "string", 1);
    fmt.required(FcDesignerOptionsJson, "string", 1);
    fmt.required(FcDesignerRuleJson, "string", 1);
    fmt.required(processConfigJson, "string", 1);

    // 根据流程id查询出表单的id
    const formIdRes = await data.getProcessById({id});

    if(formIdRes.length === 0) {
        return {};
    }
    const formTemplateId = formIdRes[0].c_template_id;

    await gate.setFormTemplateById({
        id: formTemplateId,
        name: approvalName,
        FcDesignerRuleJson,
        FcDesignerOptionsJson,
        class_id: classify
    });

    // 判断是否有更改
    if(processConfigJson !== formIdRes[0].processConfigJson) {
        // 由于节点数量过多 便采用删除所有的节点重新添加
        const processId = id;
        await data.delNodesInfo({ processId })

        const processConfig = JSON.parse(processConfigJson);
        const nodeList = getChildNode(processConfig.nodeConfig);
        let nodeTextList = nodeList.map((item, index) => {
            const {
                id,
                nodeName,
                type,
                settype,
                ccSelfSelectFlag,
                conditionNodes,
                conditionList,
                nodeUserList
            } = item;
            const c_child_node = index === nodeList.length - 1 ? "" : nodeList[index + 1].id;
            const c_father_node = index === 0 ? "" : nodeList[index - 1].id;

            return `("${id}", "${nodeName}", "${type}", "${settype}", '${nodeUserList}', "${ccSelfSelectFlag}", "${c_child_node}", "${c_father_node}", "${conditionNodes}", "${conditionList}", "${processId}")`;
        })

        await data.addNodeInfos(nodeTextList.join(','));
    }

    const mtime = formatDate(new Date());

    // 修改流程模板
    await data.setProcessById({
        id,
        approvalName,
        class_id: classify,
        processConfigJson,
        mtime,
        approverIcon,
        approvalDesc
    });

    return true;
}

/**
 * 根据id 删除流程审批模板
 * @param {*} param0 
 */
exports.delProcessById = async function({ id }){
    fmt.required(id, 'string', 1, 64);

    await data.delProcessById({ id })
    return true;
}

/**
 * 提交工单
 * @param {Object} formData 表单对象数据，key为属性id，value为属性值
 * @param {String} id 流程模板id
 * @param {String} fromTemplateid 表单模板id
 * @param {String} creator 提交申请人的id
 * 
 */
exports.addWorkOrder = async function( { formData, id, fromTemplateid, creator } ) {
    fmt.required(id, "string", 1, 128);
    fmt.required(formData, "object", 1);
    fmt.required(creator, "string", 1, 128);
    fmt.required(fromTemplateid, "string", 1, 128);

    // 检查是否有这个申请模板
    const process = await data.getProcessById({id});
    if(process.length === 0) {
        throw error("ERR_PROCESS_INVALID", "没有这个流程，不可申请");
    }


    // 1.往电子表单添加表单实例对象（添加一个新的表单，可以理解为在实际申请中打印一张申请表）
    const formObject = await gate.addFormObject({ fromTemplateid });

    // 2.往电子表单中写入数据，（可以理解为在填写申请表）
    await gate.addFormObjectValues({ objectId: formObject, formData});

    // 3.提交一个工单（可以理解为提交这个申请）
    const workOrderId = idCreate.get();
    const { c_title, c_id } = process[0];

    // 4.查询该模板下的所有节点
    // TODO
    const nodes = await data.getAllNodeInfoByProcessId({ processId: id });
    console.log(nodes);
    // 获取该流程下的开始节点
    const start = nodes.filter(item => item.c_type === "0")[0];
    console.log(start, start.c_id);
    if(!start.c_id){
        return false;
    }

    // 5.将上面的信息添加到工单
    // TODO
    await data.addWorkOrder({ 
        id: workOrderId,
        title: c_title,
        processId: c_id,
        objectId: formObject,
        ctime: formatDate(new Date()),
        mtime: formatDate(new Date()),
        creator,
        isEnd: "0",
        state: start.c_id
     });

     // 6.申请提交成功，开始进入流转（可以理解为开始进入审批流程）
     // 执行第一步
     executeNode(start.c_id, workOrderId, "1", creator, "提交了申请");

    return true;
}

// 根据用户id，获取其已发起的工单
exports.getMyStartWorkOrderByUid = async function({ uid, token }){
    fmt.required(uid, 'string', 1, 64);
    
    let workOrderList = await data.getMyStartWorkOrderByUid({ uid });

    if(workOrderList.length === 0) {
        return [];
    }

    const { username } = await getFullWorkOrder(workOrderList[0], token);
    console.log(username);
    workOrderList = workOrderList.map( item => {
        return {
            ...item,
            username
        }
    });

    return workOrderList;
}

// 根据用户id，获取已抄送的工单列表
exports.getCopyMeWorkOrderByUid = async function({ uid, token }){
    fmt.required(uid, 'string', 1, 64);
    
    const workOrderList = await data.getCopyMeWorkOrderByUid({ uid });

    if(workOrderList.length === 0) {
        return [];
    }

    let fullWorkOrderList = [];
    for(let item of workOrderList) {
        const fullWorkOrder = await getFullWorkOrder(item, token);
        fullWorkOrderList.push(fullWorkOrder);
    }
    // await workOrderList.forEach(async item => {
    //     const fullWorkOrder = await getFullWorkOrder(item, token);
    //     fullWorkOrderList.push(fullWorkOrder);
    // });

    return fullWorkOrderList;
}

// 根据用户id，获取已办的工单列表
exports.getDoneWorkOrderByUid = async function({ uid, token }){
    fmt.required(uid, 'string', 1, 64);
    
    const workOrderList = await data.getDoneWorkOrderByUid({ uid });

    if(workOrderList.length === 0) {
        return [];
    }

    let fullWorkOrderList = [];
    for(let item of workOrderList) {
        const fullWorkOrder = await getFullWorkOrder(item, token);
        fullWorkOrderList.push(fullWorkOrder);
    }
    // await workOrderList.forEach(async item => {
    //     const fullWorkOrder = await getFullWorkOrder(item, token);
    //     fullWorkOrderList.push(fullWorkOrder);
    // });

    return fullWorkOrderList;
}

// 根据用户id，获取待办的工单列表
exports.getWaitDoneWorkOrderByUid = async function({ uid, token }){
    fmt.required(uid, 'string', 1, 64);
    
    const workOrderList = await data.getWaitDoneWorkOrderByUid({ uid });

    if(workOrderList.length === 0) {
        return [];
    }

    let fullWorkOrderList = [];
    for(let item of workOrderList) {
        const fullWorkOrder = await getFullWorkOrder(item, token);
        fullWorkOrderList.push(fullWorkOrder);
    }
    // await workOrderList.forEach(async item => {
    //     const fullWorkOrder = await getFullWorkOrder(item, token);
    //     console.log(fullWorkOrder);
    //     fullWorkOrderList.push(fullWorkOrder);
    // });

    return fullWorkOrderList;
}


// 根据工单id，获取工单详情（包括表单信息，流程进度信息等）
exports.getWorkOrderById = async function({ id, token }){
    fmt.required(id, 'string', 1, 64);

    // 获取工单基本信息
    let workOrder = await data.getWorkOrderById({ id });
    workOrder = await getFullWorkOrder(workOrder[0], token);

    // 获取流转信息，并对流转列表进行排序
    let circulationList = await data.getCirculationListByWorkOrderId({ workOrderId: id });
    // TODO
    let fullCirculationList = [];
    for(let item of circulationList) {
        const fullCirculation = await circulationGetUseename(item, token);
        fullCirculationList.push(fullCirculation);
    }
    // await circulationList.forEach(async (item) => {
    //     const fullCirculation = await circulationGetUseename(item, token);
    //     fullCirculationList.push(fullCirculation);
    // })
    // circulationList = circulationList.sort((a, b) => {
    //     const t1 = Date.parse(a.c_time);
    //     const t2 = Date.parse(b.c_time);
    //     return t2 - t1;
    // });

    //获取该申请的表单数据
    const objectValues = await gate.getObjectValuesById({ objectId: workOrder.c_object_id });
    
    const workOrderDetail = {
        ...workOrder,
        circulationList: fullCirculationList,
        objectValues
    };
    return workOrderDetail;
}

// 审批工单
exports.approvalWorkOrder = async function({ workOrderId, uid, message, result }){
    fmt.required(workOrderId, 'string', 1, 64);
    fmt.required(uid, 'string', 1, 64);
    fmt.required(message, 'string', 0, 64);
    fmt.required(result, 'string', 1, 64);

    const workOrderList = await data.checkUserApprovalPower({ workOrderId, uid });
    if(workOrderList.length === 0){
        throw error("ERR_NO_POWER", "对不起，你没有权限！");
    }
    const { c_state } = workOrderList[0];

    executeNode(c_state, workOrderId, result, uid, message);
    return true;
}




/*************************************************** 工具函数 *********************************************** */

/**
 * 解析节点对象树，使其成为一条条的数据 递归
 * @param {Object} Node 节点对象
 * @returns 
 */
function getChildNode (Node){
    if(Node) {
        const x = getChildNode(Node.childNode);
        const id = idCreate.get();
        let { nodeName, type = "", settype= "", ccSelfSelectFlag= "", conditionNodes = [], conditionList = [], nodeUserList = [] } = Node;
        conditionNodes = JSON.stringify(conditionNodes);
        conditionList = JSON.stringify(conditionList);
        nodeUserList = JSON.stringify(nodeUserList);
        if(!x) {
            return [{
                id,
                nodeName,
                type,
                settype,
                ccSelfSelectFlag,
                conditionNodes,
                conditionList,
                nodeUserList
            }]
        }

        return [{
            id,
            nodeName,
            type,
            settype,
            ccSelfSelectFlag,
            conditionNodes,
            conditionList,
            nodeUserList
        }, ...x];
    }

    return false;
}

/**
 * 封装 ---- 执行步骤， 当执行到某个节点，处理人处理后，添加和修改对应的数据
 * @param {String} nodeId 节点id
 * @param {String} workOrderId 处理的工单id
 * @param {String} result 处理结果
 * @param {String} processor 处理人
 * @param {String} message 备注消息
 */
async function executeNode(nodeId, workOrderId, result, processor, message) {
    // 1.获取工单信息， 检查该工单是否结束
    // TODO
    const workOrder = await data.getWorkOrderById({ id: workOrderId });
    const { c_is_end, c_process_id } = workOrder[0];
    // 如果结束，抛出错误
    if(c_is_end === "1") {
        throw error('ERR_REEOR', "工单已结束");
    }

    // 2.添加流转信息
    const circulationId = idCreate.get();
    // TODO
    await data.addCirculation({
        id: circulationId,
        workOrderId,
        nodeId,
        message,
        processor,
        time: formatDate(new Date()),
        result
    });

    // 3.获取下一步的节点 
    // TODO
    const nextNode = await data.getNextNodeByfather({
        processId: c_process_id,
        father: nodeId
    });

    // 4.如果后面没有节点代表结束,执行结束操作
    if(nextNode.length === 0) {
        // TODO
        await data.setWorkOrderById({ 
            id: workOrderId,
            isEnd: '1',
            state: nodeId,
            mtime: formatDate(new Date())
        });
        return;
    }

    // 4.将下一步的节点用户列表都添加到用户工单关系表
    const { c_id, c_type, c_node_user_list } = nextNode[0];
    const nodeUserList = JSON.parse(c_node_user_list);

    nodeUserList.forEach( async (item) => {
        const userWorkId = idCreate.get();
        const { targetId } = item;
        // TODO
        await data.addUserToWork({
            id: userWorkId,
            type: c_type,
            workOrderId,
            userId: targetId,
            nodeId: c_id
        });
    });

    // 4.修改工单状态 (isend,state)
    let isEnd = "0";
    // 如果 result === "0" 代表拒绝改流程 isEnd = "1";
    if(result === "0") {
        isEnd = "1";
    }
    // TODO
    await data.setWorkOrderById({ 
        id: workOrderId,
        isEnd,
        state: c_id,
        mtime: formatDate(new Date())
    })

    // 5.如果是抄送节点将自动执行
    if(c_type === "2") {
        executeNode(c_id, workOrderId, "1", "0001", "抄送人，自动执行")
    }

    return true;
}

/**
 * 完善工单信息,比如发起者name，类型等
 * @param {string} workOrder 工单id
 * @returns 
 */
async function getFullWorkOrder(workOrder, token) {
    const user = await gate.getUserById({ id: workOrder.c_creator, token});
    return {
        ...workOrder,
        username: user[0].c_name
    };
}

/**
 * 根据获取流转中的处理人id，获取其姓名
 * @param {*} circulation
 * @param {*} token 
 * @returns 
 */
async function circulationGetUseename( circulation, token ) {
    const user = await gate.getUserById({ id: circulation.c_processor, token});
    return {
        ...circulation,
        username: user[0].c_name
    };
}


