## tinyqueue

使用方法

```js
// create an empty priority queue
var queue = new TinyQueue();

// add some items
queue.push(7);
queue.push(5);
queue.push(10);

// remove the top item
var top = queue.pop(); // returns 5

// return the top item (without removal)
top = queue.peek(); // returns 7

// get queue length
queue.length; // returns 2

// create a priority queue from an existing array (modifies the array)
queue = new TinyQueue([7, 5, 10]);

// pass a custom item comparator as a second argument
queue = new TinyQueue([{value: 5}, {value: 7}], function (a, b) {
	return a.value - b.value;
});

// turn a queue into a sorted array
var array = [];
while (queue.length) array.push(queue.pop());
```