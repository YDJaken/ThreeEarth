## kdbush

```js
var index = kdbush(points);              // make an index
var ids1 = index.range(10, 10, 20, 20);  // bbox search - minX, minY, maxX, maxY
var ids2 = index.within(10, 10, 5);      // radius search - x, y, radius
```

## API

#### kdbush(points[, getX, getY, nodeSize, arrayType])

Creates an index from the given points.

- `points`: Input array of points.
- `getX`, `getY`: Functions to get `x` and `y` from an input point. By default, it assumes `[x, y]` format.
- `nodeSize`: Size of the KD-tree node, `64` by default. Higher means faster indexing but slower search, and vise versa.
- `arrayType`: Array type to use for storing indices and coordinate values. `Array` by default, but if your coordinates are integer values, `Int32Array` makes things a bit faster.

```js
var index = kdbush(points, (p) => p.x, (p) => p.y, 64, Int32Array);
```

#### range(minX, minY, maxX, maxY)

Finds all items within the given bounding box and returns an array of indices that refer to the items in the original `points` input array.

```js
var results = index.range(10, 10, 20, 20).map((id) => points[id]);
```

#### within(x, y, radius)

Finds all items within a given radius from the query point and returns an array of indices.

```js
var results = index.within(10, 10, 5).map((id) => points[id]);
```
