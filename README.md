# Priority Worker Queue for asynchronous job execution

This is a worker queue built for single concurrency on asychronous job execution.

## Classes

<dl>
<dt><a href="#DefaultPriorityWorkerQueue">DefaultPriorityWorkerQueue</a> ⇐ <code><a href="#PriorityWorkerQueue">PriorityWorkerQueue</a></code></dt>
<dd><p>DefaultPriorityWorkerQueue</p>
</dd>
<dt><a href="#PriorityWorkerQueue">PriorityWorkerQueue</a> ⇐ <code>EventEmitter</code></dt>
<dd><p>PriorityWorkerQueue</p>
</dd>
</dl>

<a name="DefaultPriorityWorkerQueue"></a>

## DefaultPriorityWorkerQueue ⇐ [<code>PriorityWorkerQueue</code>](#PriorityWorkerQueue)
DefaultPriorityWorkerQueue

**Kind**: global class  
**Extends**: [<code>PriorityWorkerQueue</code>](#PriorityWorkerQueue)  
<a name="DefaultPriorityWorkerQueue+enqueue"></a>

### pwq.enqueue(func, args, [priority]) ⇒ <code>promise</code>
Overloaded version of PriorityWorkerQueue.enqueue. Allows enqueue of a function without the wrapping object for
ease. Allows arguments array to be passed as second argument.

**Kind**: instance method of [<code>DefaultPriorityWorkerQueue</code>](#DefaultPriorityWorkerQueue)  
**Overrides**: [<code>enqueue</code>](#PriorityWorkerQueue+enqueue)  
**Returns**: <code>promise</code> - Result of the enqueued function  

| Param | Type | Description |
| --- | --- | --- |
| func | <code>object</code> \| <code>function</code> | Job object or function to be run. |
| args | <code>array</code> \| <code>number</code> | Array of arguments (or priority if no arguments) |
| [priority] | <code>number</code> | The priority of a job when both func/args are given |

<a name="PriorityWorkerQueue"></a>

## PriorityWorkerQueue ⇐ <code>EventEmitter</code>
PriorityWorkerQueue

**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [PriorityWorkerQueue](#PriorityWorkerQueue) ⇐ <code>EventEmitter</code>
    * [new PriorityWorkerQueue(worker)](#new_PriorityWorkerQueue_new)
    * [.enqueue(job, priority)](#PriorityWorkerQueue+enqueue) ⇒ <code>promise</code>

<a name="new_PriorityWorkerQueue_new"></a>

### new PriorityWorkerQueue(worker)

| Param | Type | Description |
| --- | --- | --- |
| worker | <code>function</code> | The worker to run on each job supplied to the queue |

<a name="PriorityWorkerQueue+enqueue"></a>

### pwq.enqueue(job, priority) ⇒ <code>promise</code>
Adds a job to the queue to process. Resolves with the result of the function execution, or rejects with the error
provided. Whenever a job is enqueued, execution of all jobs is slated for the next tick of the eventloop based on
priority.

**Kind**: instance method of [<code>PriorityWorkerQueue</code>](#PriorityWorkerQueue)  
**Returns**: <code>promise</code> - Retuns the result of the worker when running the job.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| job | <code>object</code> |  | The job to be run |
| priority | <code>Number</code> | <code>0</code> | The priority of the job (higher number is a higher priority) |


# License

&copy; 2020 Mudrekh Goderya MIT
