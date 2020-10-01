const crypto = require('crypto');
const EventEmitter = require('events');

const PriorityQueue = require('priorityqueuejs');
const debug = require('debug')('PriorityWorkerQueue');

const NUM_BYTES = 16;
const uuid = () => crypto.randomBytes(NUM_BYTES).toString('hex');

/**
 * Creates a PriorityWorkerQueue. A PriorityWorkerQueue accepts a job in its contructor to apply to every job
 * supplied. Jobs are processed one at a time in order spedified by priority and time. Jobs of a given priority are
 * always run in order supplied.
 * @class  PriorityWorkerQueue
 * @typicalname pwq
 * @extends {EventEmitter}
 * @constructor
 * @param {function} worker The worker to run on each job supplied to the queue
 */
class PriorityWorkerQueue extends EventEmitter {

  constructor(worker) {
    super();
    if (!(worker instanceof Function)) {
      throw new Error('Worker must be a function that accepts a job');
    }
    this._worker = async (...args) => worker(...args);
    this._queue = new PriorityQueue((job1, job2) => {
      if (job1.priority === job2.priority) {
        if (job1.time === job2.time) {
          return job2.hrtime[1] - job1.hrtime[1];
        }
        return job2.time - job1.time;
      }
      return job1.priority - job2.priority;
    });
  }

  /**
   * Adds a job to the queue to process. Resolves with the result of the function execution, or rejects with the error
   * provided. Whenever a job is enqueued, execution of all jobs is slated for the next tick of the eventloop based on
   * priority.
   * @param  {object} job      The job to be run
   * @param  {Number} priority The priority of the job (higher number is a higher priority)
   * @return {promise}          Retuns the result of the worker when running the job.
   */
  async enqueue(job, priority = 0) {
    debug('enqueue', job, priority);
    const item = {
      job,
      priority,
      time: Date.now(),
      hrtime: process.hrtime(),
      id: uuid()
    };
    return new Promise((resolve, reject) => {
      if (this._queue.isEmpty()) {
        debug('process start');
        setImmediate(() => this._process());
      }
      this.once(`${item.id}:complete`, resolve);
      this.once(`${item.id}:error`, reject);
      this._queue.enq(item);
    })
      .finally(() => this._cleanUp(item.id));
  }

  /**
   * Helper function to clean up ids when jobs have finished
   * @private
   * @param  {string} jid The id of the job
   * @return {void}
   */
  _cleanUp(jid) {
    debug('cleanup', jid);
    this.removeAllListeners(`${jid}:success`);
    this.removeAllListeners(`${jid}:error`);
  }

  /**
   * Helper function to process jobs. Emits an empty events when no more jobs are processed. A job is processed every
   * tick of an event loop.
   * @private
   * @return {Boolean} True if a job was executed, false if not
   */
  async _process() {
    if (this._processing) {
      return false;
    }
    this._processing = true;
    if (this._queue.isEmpty()) {
      this.emit('empty');
    } else {
      const { job, id } = this._queue.deq();
      try {
        debug('job', id);
        const result = await this._worker(job)
          .finally(() => setImmediate(() => this._process()));
        debug('job', id, 'complete');
        this.emit(`${id}:complete`, result);
      } catch (err) {
        debug('job', id, 'error');
        this.emit(`${id}:error`, err);
      }
    }
    this._processing = false;
    return true;
  }
}


module.exports = PriorityWorkerQueue;
