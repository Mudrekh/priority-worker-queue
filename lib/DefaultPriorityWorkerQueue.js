const PriorityWorkerQueue = require('./PriorityWorkerQueue.js');

/**
 * Creates a PriorityWorkerQueue that has default worker that processes a function with a given set of args.
 * @class  DefaultPriorityWorkerQueue
 * @extends {PriorityWorkerQueue}
 * @typicalname pwq
 * @constructor
 */

class DefaultPriorityWorkerQueue extends PriorityWorkerQueue {
  constructor() {
    super(({ args = [], func }) => func(...args));
  }

  /**
   * Overloaded version of PriorityWorkerQueue.enqueue. Allows enqueue of a function without the wrapping object for
   * ease. Allows arguments array to be passed as second argument.
   * @async
   * @param  {object|function} func     Job object or function to be run.
   * @param  {array|number} args     Array of arguments (or priority if no arguments)
   * @param  {number} [priority] The priority of a job when both func/args are given
   * @return {promise}          Result of the enqueued function
   */
  enqueue(func, args, priority) {
    // allow enqueue of single functions to run with optional array args
    if (typeof func === 'function') {
      return super.enqueue({
        func,
        args
      }, priority);
    }
    return super.enqueue(func, typeof args === 'number' ? args : priority); // Asumme func/args object
  }
}

module.exports = DefaultPriorityWorkerQueue;
