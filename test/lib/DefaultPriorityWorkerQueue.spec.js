const DefaultPriorityWorkerQueue = require('../../lib/DefaultPriorityWorkerQueue.js');

describe('DefaultPriorityWorkerQueue', () => {
  context('Processing jobs', () => {
    let pwq;
    before(() => {
      pwq = new DefaultPriorityWorkerQueue();
    });
    it('should process a job', async () => {
      const stub = sinon.stub().resolves(1234);
      const value = await pwq.enqueue({ func: stub });
      value.should.equal(1234);
    });
    it('should process a job with args', async () => {
      const stub = sinon.stub().returnsArg(0);
      const value = await pwq.enqueue({
        func: stub,
        args: [1234]
      });
      value.should.equal(1234);
    });
    it('should process a job with args and priority', async () => {
      const stub = sinon.stub().returnsArg(0);
      const stub2 = sinon.stub().returnsArg(0);
      pwq.enqueue({
        func: stub,
        args: [1234]
      }, 0);
      pwq.enqueue({
        func: stub2,
        args: [1234]
      }, 10);
      await new Promise(resolve => pwq.on('empty', resolve));
      stub.should.have.been.calledAfter(stub2);
    });
    it('should enqueue just a function', async () => {
      const stub = sinon.stub().returns(17);
      const value = await pwq.enqueue(stub);
      value.should.equal(17);
      stub.should.have.been.called;
    });
    it('should enqueue a function with args', async () => {
      const stub = sinon.stub().returnsArg(0);
      const value = await pwq.enqueue(stub, [17]);
      value.should.equal(17);
      stub.should.have.been.called;
    });
    it('should enqueue a function with priority', async () => {
      const stub = sinon.stub().returnsArg(0);
      const stub2 = sinon.stub().returnsArg(0);
      pwq.enqueue(stub, [17]);
      pwq.enqueue(stub2, [18], 1);
      await new Promise(resolve => pwq.on('empty', resolve));
      stub.should.have.been.calledAfter(stub2);
    });
  });
});
