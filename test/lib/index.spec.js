const Queues = require('../..');
describe('index', () => {
  it('should export PriorityWorkerQueue', () => {
    Queues.should.have.property('PriorityWorkerQueue');
  });
  it('should export DefaultPriorityWorkerQueue', () => {
    Queues.should.have.property('DefaultPriorityWorkerQueue');
  });
});
