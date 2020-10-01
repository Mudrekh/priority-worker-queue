const util = require('util');
const EventEmitter = require('events');

const PriorityWorkerQueue = require('../../lib/PriorityWorkerQueue.js');

const timeout = util.promisify(setTimeout);
const immediate = util.promisify(setImmediate);

describe('PriorityWorkerQueue', () => {
  context('The constructor', () => {
    it('should throw if not passed a function', () => {
      (() => new PriorityWorkerQueue()).should.throw();
    });
  });

  context('Processing jobs', () => {
    let pwq;
    beforeEach(() => {
      pwq = new PriorityWorkerQueue(({ func, args = [] }) => func(...args));
    });
    it('should process a job', async () => {
      const spy = sinon.stub().resolves('thing');
      await pwq.enqueue({ func: spy });
      spy.should.have.been.called;
    });
    it('should process jobs in order (hrtime)', async () => {
      const spy1 = sinon.stub();
      const spy2 = sinon.stub();
      pwq.enqueue({ func: spy1 });
      pwq.enqueue({ func: spy2 });
      await new Promise(resolve => pwq.once('empty', resolve));
      spy1.should.have.been.called;
      spy2.should.have.been.called;
      spy1.should.have.been.calledBefore(spy2);
    });
    it('should process jobs in order (time)', async () => {
      const job1 = {
        job: { func: sinon.stub() },
        time: Date.now(),
        priority: 0,
        id: 'TESTID'
      };
      const job2 = {
        job: { func: sinon.stub() },
        time: Date.now() + 1,
        priority: 0,
        id: 'TESTID2'
      };
      pwq._queue.enq(job2);
      pwq._queue.enq(job1);
      setImmediate(() => pwq._process());
      await new Promise(resolve => pwq.once('empty', resolve));
      job1.job.func.should.have.been.called;
      job2.job.func.should.have.been.called;
      job1.job.func.should.have.been.calledBefore(job2.job.func);
    });
    it('should process jobs with higher priority first', async () => {
      const spy1 = sinon.stub();
      const spy2 = sinon.stub();
      pwq.enqueue({ func: spy1 });
      pwq.enqueue({ func: spy2 }, 1);
      await new Promise(resolve => pwq.once('empty', resolve));
      spy1.should.have.been.called;
      spy2.should.have.been.called;
      spy1.should.have.been.calledAfter(spy2);
    });
    it('should process jobs as they come in', async () => {
      const spy1 = sinon.stub();
      const spy2 = sinon.stub();
      pwq.enqueue({ func: spy1 });
      await timeout(10);
      spy1.should.have.been.called;
      pwq.enqueue({ func: spy2 }, 1);
      await timeout(10);
      spy2.should.have.been.called;
    });
    it('should reject when the job throws', async () => {
      const spy = sinon.stub().rejects();
      await pwq.enqueue({ func: spy }).should.eventually.be.rejected;
    });
    it('should only process one job at a time', async () => {
      const emitter = new EventEmitter();
      const res1 = new Promise(resolve => emitter.on('a', resolve));
      const res2 = new Promise(resolve => emitter.on('b', resolve));
      const p1 = pwq.enqueue({ func: () => res1 });
      const p2 = pwq.enqueue({ func: () => res2 });
      await immediate();
      should.equal(await pwq._process(), false);
      emitter.emit('a');
      emitter.emit('b');
      await Promise.all([p1, p2]);
    });
  });
});
