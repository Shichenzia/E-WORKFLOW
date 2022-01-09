'use strict';

const { libs, runtime } = nodex;
const { http } = libs;
const { logic } = runtime;

const gate = require('./gate');

exports.init = async function (args) {
  console.log('serv init.');
  console.log('serv init args:', args);
  console.log('runtime:', runtime);

  const app = http.webapp(args);

  app.route(router => {
    router.get('/', http.handler(logic.helloWorld))

    router.post('/get_all_class', http.handler(logic.getAllClass));
    router.post('/add_class', auth, http.handler(logic.addClass));
    router.post('/set_class_by_id', auth, http.handler(logic.setClassById));
    router.post('/del_class_by_id', auth, http.handler(logic.delClassById));

    router.post('/get_all_process', auth, http.handler(logic.getAllprocess));
    router.post('/get_process_by_id', http.handler(logic.getProcessById));
    router.post('/set_process_by_id', auth, http.handler(logic.setProcessById));
    router.post('/del_process_by_id', auth, http.handler(logic.delProcessById));
    router.post('/add_process_tmp', auth, http.handler(logic.addProcessTmp));
    router.post('/issue_process', auth, http.handler(logic.addProcessTmp));

    router.post('/add_work_order', auth, http.handler(logic.addWorkOrder));
    router.post('/get_my_start_work_order_by_uid', auth, http.handler(logic.getMyStartWorkOrderByUid));
    router.post('/get_copy_me_work_order_by_uid', auth, http.handler(logic.getCopyMeWorkOrderByUid));
    router.post('/get_done_work_order_by_uid', auth, http.handler(logic.getDoneWorkOrderByUid));
    router.post('/get_wait_done_work_order_by_uid', auth, http.handler(logic.getWaitDoneWorkOrderByUid));
    router.post('/get_work_order_by_id', auth, http.handler(logic.getWorkOrderById));

    router.post('/approval_work_order', auth, http.handler(logic.approvalWorkOrder));



    
  });

  app.start();
};

async function auth(ctx, next) {
  const userInfo = await gate.auth(ctx.request.body);
  if (!userInfo) {
      throw error('ERR_TOKEN_INVALID', 'Token invalid.');
  }
  ctx.state.userInfo = userInfo;
  return next();
}