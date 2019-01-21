RBush
=====

## Usage

### Creating a Tree

```js
var tree = rbush();
```

An optional argument to `rbush` defines the maximum number of entries in a tree node.
`9` (used by default) is a reasonable choice for most applications.
Higher value means faster insertion and slower search, and vice versa.

```js
var tree = rbush(16);
```

### Adding Data

Insert an item:

```js
var item = {
    minX: 20,
    minY: 40,
    maxX: 30,
    maxY: 50,
    foo: 'bar'
};
tree.insert(item);
```

### Removing Data

Remove a previously inserted item:

```js
tree.remove(item);
```

By default, RBush removes objects by reference.
However, you can pass a custom `equals` function to compare by value for removal,
which is useful when you only have a copy of the object you need removed (e.g. loaded from server):

```js
tree.remove(itemCopy, function (a, b) {
    return a.id === b.id;
});
```

Remove all items:

```js
tree.clear();
```

### Data Format

By default, RBush assumes the format of data points to be an object
with `minX`, `minY`, `maxX` and `maxY` properties.
You can customize this by providing an array with corresponding accessor strings
as a second argument to `rbush` like this:

```js
var tree = rbush(9, ['[0]', '[1]', '[0]', '[1]']); // accept [x, y] points
tree.insert([20, 50]);
```

If you're indexing a static list of points (you don't need to add/remove points after indexing), you should use [kdbush](https://github.com/mourner/kdbush) which performs point indexing 5-8x faster than RBush.

### Bulk-Inserting Data

Bulk-insert the given data into the tree:

```js
tree.load([item1, item2, ...]);
```

Bulk insertion is usually ~2-3 times faster than inserting items one by one.
After bulk loading (bulk insertion into an empty tree),
subsequent query performance is also ~20-30% better.

Note that when you do bulk insertion into an existing tree,
it bulk-loads the given data into a separate tree
and inserts the smaller tree into the larger tree.
This means that bulk insertion works very well for clustered data
(where items in one update are close to each other),
but makes query performance worse if the data is scattered.

### Search

```js
var result = tree.search({
    minX: 40,
    minY: 20,
    maxX: 80,
    maxY: 70
});
```

Returns an array of data items (points or rectangles) that the given bounding box intersects.

Note that the `search` method accepts a bounding box in `{minX, minY, maxX, maxY}` format
regardless of the format specified in the constructor (which only affects inserted objects).

```js
var allItems = tree.all();
```

Returns all items of the tree.

### Collisions

```js
var result = tree.collides({minX: 40, minY: 20, maxX: 80, maxY: 70});
```

Returns `true` if there are any items intersecting the given bounding box, otherwise `false`.


### Export and Import

```js
// export data as JSON object
var treeData = tree.toJSON();

// import previously exported data
var tree = rbush(9).fromJSON(treeData);
```

Importing and exporting as JSON allows you to use RBush on both the server (using Node.js) and the browser combined,
e.g. first indexing the data on the server and and then importing the resulting tree data on the client for searching.

Note that the `nodeSize` option passed to the constructor must be the same in both trees for export/import to work properly.
