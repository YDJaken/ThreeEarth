/**
 * R-Tree 可以以长方形或者点的形式存储信息,加速搜索速度
 * @Author DongYi
 */

import {quickselect} from "../QuickSelect/quickselect.js";

class RBush {
    constructor(maxEntries = 9, format) {
        if (!(this instanceof RBush)) return new RBush(maxEntries, format);
        // max entries in a node is 9 by default; min node fill is 40% for best performance
        this._maxEntries = Math.max(4, maxEntries);
        this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));
        if (format) {
            this._initFormat(format);
        } else {
            this.toBBox = function (item) {
                return item;
            };
            this.compareMinX = RBush.compareNodeMinX;
            this.compareMinY = RBush.compareNodeMinY;
        }
        this.clear();
    }

    static findItem(item, items, equalsFn) {
        if (!equalsFn) return items.indexOf(item);

        for (let i = 0; i < items.length; i++) {
            if (equalsFn(item, items[i])) return i;
        }
        return -1;
    }

    // calculate node's bbox from bboxes of its children
    static calcBBox(node, toBBox) {
        RBush.distBBox(node, 0, node.children.length, toBBox, node);
    }

    // min bounding rectangle of node children from k to p-1
    static distBBox(node, k, p, toBBox, destNode) {
        if (!destNode) destNode = RBush.createNode(null);
        destNode.minX = Infinity;
        destNode.minY = Infinity;
        destNode.maxX = -Infinity;
        destNode.maxY = -Infinity;

        for (let i = k, child; i < p; i++) {
            child = node.children[i];
            RBush.extend(destNode, node.leaf ? toBBox(child) : child);
        }

        return destNode;
    }

    static extend(a, b) {
        a.minX = Math.min(a.minX, b.minX);
        a.minY = Math.min(a.minY, b.minY);
        a.maxX = Math.max(a.maxX, b.maxX);
        a.maxY = Math.max(a.maxY, b.maxY);
        return a;
    }

    static compareNodeMinX(a, b) {
        return a.minX - b.minX;
    }

    static compareNodeMinY(a, b) {
        return a.minY - b.minY;
    }

    static bboxArea(a) {
        return (a.maxX - a.minX) * (a.maxY - a.minY);
    }

    static bboxMargin(a) {
        return (a.maxX - a.minX) + (a.maxY - a.minY);
    }

    static enlargedArea(a, b) {
        return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) *
            (Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
    }

    static intersectionArea(a, b) {
        let minX = Math.max(a.minX, b.minX),
            minY = Math.max(a.minY, b.minY),
            maxX = Math.min(a.maxX, b.maxX),
            maxY = Math.min(a.maxY, b.maxY);

        return Math.max(0, maxX - minX) *
            Math.max(0, maxY - minY);
    }

    static contains(a, b) {
        return a.minX <= b.minX &&
            a.minY <= b.minY &&
            b.maxX <= a.maxX &&
            b.maxY <= a.maxY;
    }

    static intersects(a, b) {
        return b.minX <= a.maxX &&
            b.minY <= a.maxY &&
            b.maxX >= a.minX &&
            b.maxY >= a.minY;
    }

    static createNode(children) {
        return {
            children: children,
            height: 1,
            leaf: true,
            minX: Infinity,
            minY: Infinity,
            maxX: -Infinity,
            maxY: -Infinity
        };
    }

    // sort an array so that items come in groups of n unsorted items, with groups sorted between each other;
    // combines selection algorithm with binary divide & conquer approach
    static multiSelect(arr, left, right, n, compare) {
        let stack = [left, right],
            mid;

        while (stack.length) {
            right = stack.pop();
            left = stack.pop();

            if (right - left <= n) continue;

            mid = left + Math.ceil((right - left) / n / 2) * n;
            quickselect.Quickselect(arr, mid, left, right, compare);

            stack.push(left, mid, mid, right);
        }
    }

    all() {
        return RBush._all(this.data, []);
    }

    search(bbox) {
        let node = this.data,
            result = [],
            toBBox = this.toBBox;
        if (!RBush.intersects(bbox, node)) return result;
        let nodesToSearch = [],
            i, len, child, childBBox;
        while (node) {
            for (i = 0, len = node.children.length; i < len; i++) {
                child = node.children[i];
                childBBox = node.leaf ? toBBox(child) : child;
                if (RBush.intersects(bbox, childBBox)) {
                    if (node.leaf) result.push(child);
                    else if (RBush.contains(bbox, childBBox)) RBush._all(child, result);
                    else nodesToSearch.push(child);
                }
            }
            node = nodesToSearch.pop();
        }
        return result;
    }

    collides(bbox) {
        let node = this.data,
            toBBox = this.toBBox;
        if (!RBush.intersects(bbox, node)) return false;
        let nodesToSearch = [],
            i, len, child, childBBox;
        while (node) {
            for (i = 0, len = node.children.length; i < len; i++) {
                child = node.children[i];
                childBBox = node.leaf ? toBBox(child) : child;
                if (RBush.intersects(bbox, childBBox)) {
                    if (node.leaf || RBush.contains(bbox, childBBox)) return true;
                    nodesToSearch.push(child);
                }
            }
            node = nodesToSearch.pop();
        }
        return false;
    }

    load(data) {
        if (!(data && data.length)) return this;
        if (data.length < this._minEntries) {
            for (let i = 0, len = data.length; i < len; i++) {
                this.insert(data[i]);
            }
            return this;
        }
        // recursively build the tree with the given data from scratch using OMT algorithm
        let node = this._build(data.slice(), 0, data.length - 1, 0);
        if (!this.data.children.length) {
            // save as is if tree is empty
            this.data = node;
        } else if (this.data.height === node.height) {
            // split root if trees have the same height
            this._splitRoot(this.data, node);
        } else {
            if (this.data.height < node.height) {
                // swap trees if inserted one is bigger
                let tmpNode = this.data;
                this.data = node;
                node = tmpNode;
            }
            // insert the small tree into the large tree at appropriate level
            this._insert(node, this.data.height - node.height - 1, true);
        }
        return this;
    }

    insert(item) {
        if (item) this._insert(item, this.data.height - 1);
        return this;
    }

    clear() {
        this.data = RBush.createNode([]);
        return this;
    }

    remove(item, equalsFn) {
        if (!item) return this;
        let node = this.data,
            bbox = this.toBBox(item),
            path = [],
            indexes = [],
            i, parent, index, goingUp;
        // depth-first iterative tree traversal
        while (node || path.length) {
            if (!node) { // go up
                node = path.pop();
                parent = path[path.length - 1];
                i = indexes.pop();
                goingUp = true;
            }
            if (node.leaf) { // check current node
                index = RBush.findItem(item, node.children, equalsFn);
                if (index !== -1) {
                    // item found, remove the item and condense tree upwards
                    node.children.splice(index, 1);
                    path.push(node);
                    this._condense(path);
                    return this;
                }
            }
            if (!goingUp && !node.leaf && RBush.contains(node, bbox)) { // go down
                path.push(node);
                indexes.push(i);
                i = 0;
                parent = node;
                node = node.children[0];
            } else if (parent) { // go right
                i++;
                node = parent.children[i];
                goingUp = false;
            } else node = null; // nothing found
        }
        return this;
    }

    toJSON() {
        return this.data;
    }

    fromJSON(data) {
        this.data = data;
        return this;
    }

    static _all(node, result) {
        let nodesToSearch = [];
        while (node) {
            if (node.leaf) result.push.apply(result, node.children);
            else nodesToSearch.push.apply(nodesToSearch, node.children);

            node = nodesToSearch.pop();
        }
        return result;
    }

    _build(items, left, right, height) {

        let N = right - left + 1,
            M = this._maxEntries,
            node;

        if (N <= M) {
            // reached leaf level; return leaf
            node = RBush.createNode(items.slice(left, right + 1));
            RBush.calcBBox(node, this.toBBox);
            return node;
        }

        if (!height) {
            // target height of the bulk-loaded tree
            height = Math.ceil(Math.log(N) / Math.log(M));

            // target number of root entries to maximize storage utilization
            M = Math.ceil(N / Math.pow(M, height - 1));
        }

        node = RBush.createNode([]);
        node.leaf = false;
        node.height = height;

        // split the items into M mostly square tiles

        let N2 = Math.ceil(N / M),
            N1 = N2 * Math.ceil(Math.sqrt(M)),
            i, j, right2, right3;

        RBush.multiSelect(items, left, right, N1, this.compareMinX);

        for (i = left; i <= right; i += N1) {

            right2 = Math.min(i + N1 - 1, right);

            RBush.multiSelect(items, i, right2, N2, this.compareMinY);

            for (j = i; j <= right2; j += N2) {

                right3 = Math.min(j + N2 - 1, right2);

                // pack each entry recursively
                node.children.push(this._build(items, j, right3, height - 1));
            }
        }

        RBush.calcBBox(node, this.toBBox);

        return node;
    }

    static _chooseSubtree(bbox, node, level, path) {

        let i, len, child, targetNode, area, enlargement, minArea, minEnlargement;

        while (true) {
            path.push(node);

            if (node.leaf || path.length - 1 === level) break;

            minArea = minEnlargement = Infinity;

            for (i = 0, len = node.children.length; i < len; i++) {
                child = node.children[i];
                area = RBush.bboxArea(child);
                enlargement = RBush.enlargedArea(bbox, child) - area;

                // choose entry with the least area enlargement
                if (enlargement < minEnlargement) {
                    minEnlargement = enlargement;
                    minArea = area < minArea ? area : minArea;
                    targetNode = child;

                } else if (enlargement === minEnlargement) {
                    // otherwise choose one with the smallest area
                    if (area < minArea) {
                        minArea = area;
                        targetNode = child;
                    }
                }
            }

            node = targetNode || node.children[0];
        }

        return node;
    }

    _insert(item, level, isNode) {

        let toBBox = this.toBBox,
            bbox = isNode ? item : toBBox(item),
            insertPath = [];

        // find the best node for accommodating the item, saving all nodes along the path too
        let node = RBush._chooseSubtree(bbox, this.data, level, insertPath);

        // put the item into the node
        node.children.push(item);
        RBush.extend(node, bbox);

        // split on node overflow; propagate upwards if necessary
        while (level >= 0) {
            if (insertPath[level].children.length > this._maxEntries) {
                this._split(insertPath, level);
                level--;
            } else break;
        }

        // adjust bboxes along the insertion path
        RBush._adjustParentBBoxes(bbox, insertPath, level);
    }

    // split overflowed node into two
    _split(insertPath, level) {

        let node = insertPath[level],
            M = node.children.length,
            m = this._minEntries;

        this._chooseSplitAxis(node, m, M);

        let splitIndex = this._chooseSplitIndex(node, m, M);

        let newNode = RBush.createNode(node.children.splice(splitIndex, node.children.length - splitIndex));
        newNode.height = node.height;
        newNode.leaf = node.leaf;

        RBush.calcBBox(node, this.toBBox);
        RBush.calcBBox(newNode, this.toBBox);

        if (level) insertPath[level - 1].children.push(newNode);
        else this._splitRoot(node, newNode);
    }

    _splitRoot(node, newNode) {
        // split root node
        this.data = RBush.createNode([node, newNode]);
        this.data.height = node.height + 1;
        this.data.leaf = false;
        RBush.calcBBox(this.data, this.toBBox);
    }

    _chooseSplitIndex(node, m, M) {

        let i, bbox1, bbox2, overlap, area, minOverlap, minArea, index;

        minOverlap = minArea = Infinity;

        for (i = m; i <= M - m; i++) {
            bbox1 = RBush.distBBox(node, 0, i, this.toBBox);
            bbox2 = RBush.distBBox(node, i, M, this.toBBox);

            overlap = RBush.intersectionArea(bbox1, bbox2);
            area = RBush.bboxArea(bbox1) + RBush.bboxArea(bbox2);

            // choose distribution with minimum overlap
            if (overlap < minOverlap) {
                minOverlap = overlap;
                index = i;

                minArea = area < minArea ? area : minArea;

            } else if (overlap === minOverlap) {
                // otherwise choose distribution with minimum area
                if (area < minArea) {
                    minArea = area;
                    index = i;
                }
            }
        }

        return index;
    }

    // sorts node children by the best axis for split
    _chooseSplitAxis(node, m, M) {

        let compareMinX = node.leaf ? this.compareMinX : RBush.compareNodeMinX,
            compareMinY = node.leaf ? this.compareMinY : RBush.compareNodeMinY,
            xMargin = this._allDistMargin(node, m, M, compareMinX),
            yMargin = this._allDistMargin(node, m, M, compareMinY);

        // if total distributions margin value is minimal for x, sort by minX,
        // otherwise it's already sorted by minY
        if (xMargin < yMargin) node.children.sort(compareMinX);
    }

    // total margin of all possible split distributions where each node is at least m full
    _allDistMargin(node, m, M, compare) {

        node.children.sort(compare);

        let toBBox = this.toBBox,
            leftBBox = RBush.distBBox(node, 0, m, toBBox),
            rightBBox = RBush.distBBox(node, M - m, M, toBBox),
            margin = RBush.bboxMargin(leftBBox) + RBush.bboxMargin(rightBBox),
            i, child;

        for (i = m; i < M - m; i++) {
            child = node.children[i];
            RBush.extend(leftBBox, node.leaf ? toBBox(child) : child);
            margin += RBush.bboxMargin(leftBBox);
        }

        for (i = M - m - 1; i >= m; i--) {
            child = node.children[i];
            RBush.extend(rightBBox, node.leaf ? toBBox(child) : child);
            margin += RBush.bboxMargin(rightBBox);
        }

        return margin;
    }

    static _adjustParentBBoxes(bbox, path, level) {
        // adjust bboxes along the given tree path
        for (let i = level; i >= 0; i--) {
            RBush.extend(path[i], bbox);
        }
    }

    _condense(path) {
        // go through the path, removing empty nodes and updating bboxes
        for (let i = path.length - 1, siblings; i >= 0; i--) {
            if (path[i].children.length === 0) {
                if (i > 0) {
                    siblings = path[i - 1].children;
                    siblings.splice(siblings.indexOf(path[i]), 1);

                } else this.clear();

            } else RBush.calcBBox(path[i], this.toBBox);
        }
    }

    _initFormat(format) {
        // data format (minX, minY, maxX, maxY accessors)

        // uses eval-type function compilation instead of just accepting a toBBox function
        // because the algorithms are very sensitive to sorting functions performance,
        // so they should be dead simple and without inner calls

        let compareArr = ['return a', ' - b', ';'];

        this.compareMinX = new Function('a', 'b', compareArr.join(format[0]));
        this.compareMinY = new Function('a', 'b', compareArr.join(format[1]));

        this.toBBox = new Function('a',
            'return {minX: a' + format[0] +
            ', minY: a' + format[1] +
            ', maxX: a' + format[2] +
            ', maxY: a' + format[3] + '};');
    }
}

export {RBush}