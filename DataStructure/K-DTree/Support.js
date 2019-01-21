/**
 * KD-Tree 辅助类
 * @Author DongYi
 */
class Support {
    static sortKD(ids, coords, nodeSize, left, right, depth) {
        if (right - left <= nodeSize) return;

        let m = Math.floor((left + right) / 2);

        Support.select(ids, coords, m, left, right, depth % 2);

        Support.sortKD(ids, coords, nodeSize, left, m - 1, depth + 1);
        Support.sortKD(ids, coords, nodeSize, m + 1, right, depth + 1);
    }

    static select(ids, coords, k, left, right, inc) {

        while (right > left) {
            if (right - left > 600) {
                let n = right - left + 1;
                let m = k - left + 1;
                let z = Math.log(n);
                let s = 0.5 * Math.exp(2 * z / 3);
                let sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
                let newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
                let newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
                select(ids, coords, k, newLeft, newRight, inc);
            }

            let t = coords[2 * k + inc];
            let i = left;
            let j = right;

            Support.swapItem(ids, coords, left, k);
            if (coords[2 * right + inc] > t) Support.swapItem(ids, coords, left, right);

            while (i < j) {
                Support.swapItem(ids, coords, i, j);
                i++;
                j--;
                while (coords[2 * i + inc] < t) i++;
                while (coords[2 * j + inc] > t) j--;
            }

            if (coords[2 * left + inc] === t) Support.swapItem(ids, coords, left, j);
            else {
                j++;
                Support.swapItem(ids, coords, j, right);
            }

            if (j <= k) left = j + 1;
            if (k <= j) right = j - 1;
        }
    }

    static swapItem(ids, coords, i, j) {
        Support.swap(ids, i, j);
        Support.swap(coords, 2 * i, 2 * j);
        Support.swap(coords, 2 * i + 1, 2 * j + 1);
    }

    static swap(arr, i, j) {
        let tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }

    static within(ids, coords, qx, qy, r, nodeSize) {
        let stack = [0, ids.length - 1, 0];
        let result = [];
        let r2 = r * r;

        while (stack.length) {
            let axis = stack.pop();
            let right = stack.pop();
            let left = stack.pop();

            if (right - left <= nodeSize) {
                for (let i = left; i <= right; i++) {
                    if (Support.sqDist(coords[2 * i], coords[2 * i + 1], qx, qy) <= r2) result.push(ids[i]);
                }
                continue;
            }

            let m = Math.floor((left + right) / 2);

            let x = coords[2 * m];
            let y = coords[2 * m + 1];

            if (Support.sqDist(x, y, qx, qy) <= r2) result.push(ids[m]);

            let nextAxis = (axis + 1) % 2;

            if (axis === 0 ? qx - r <= x : qy - r <= y) {
                stack.push(left);
                stack.push(m - 1);
                stack.push(nextAxis);
            }
            if (axis === 0 ? qx + r >= x : qy + r >= y) {
                stack.push(m + 1);
                stack.push(right);
                stack.push(nextAxis);
            }
        }

        return result;
    }

    static sqDist(ax, ay, bx, by) {
        let dx = ax - bx;
        let dy = ay - by;
        return dx * dx + dy * dy;
    }

    static range(ids, coords, minX, minY, maxX, maxY, nodeSize) {
        let stack = [0, ids.length - 1, 0];
        let result = [];
        let x, y;

        while (stack.length) {
            let axis = stack.pop();
            let right = stack.pop();
            let left = stack.pop();

            if (right - left <= nodeSize) {
                for (let i = left; i <= right; i++) {
                    x = coords[2 * i];
                    y = coords[2 * i + 1];
                    if (x >= minX && x <= maxX && y >= minY && y <= maxY) result.push(ids[i]);
                }
                continue;
            }

            let m = Math.floor((left + right) / 2);

            x = coords[2 * m];
            y = coords[2 * m + 1];

            if (x >= minX && x <= maxX && y >= minY && y <= maxY) result.push(ids[m]);

            let nextAxis = (axis + 1) % 2;

            if (axis === 0 ? minX <= x : minY <= y) {
                stack.push(left);
                stack.push(m - 1);
                stack.push(nextAxis);
            }
            if (axis === 0 ? maxX >= x : maxY >= y) {
                stack.push(m + 1);
                stack.push(right);
                stack.push(nextAxis);
            }
        }

        return result;
    }

}

//module.exports = Support;
export {Support}