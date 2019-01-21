/**
 * quickselect , 快速从一个数组的[left,right]按照compare指定的方式排列为[left,k],[k+1,right]为原顺序
 * @Author DongYi
 */

class quickselect {
    static Quickselect(arr, k, left = 0, right, compare = Quickselect.defaultCompare) {
        Quickselect.quickselectStep(arr, k, left, right || (arr.length - 1), compare);
    }

    static quickselectStep(arr, k, left, right, compare) {
        while (right > left) {
            if (right - left > 600) {
                let n = right - left + 1;
                let m = k - left + 1;
                let z = Math.log(n);
                let s = 0.5 * Math.exp(2 * z / 3);
                let sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
                let newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
                let newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
                Quickselect.quickselectStep(arr, k, newLeft, newRight, compare);
            }
            let t = arr[k];
            let i = left;
            let j = right;
            Quickselect.swap(arr, left, k);
            if (compare(arr[right], t) > 0) Quickselect.swap(arr, left, right);
            while (i < j) {
                Quickselect.swap(arr, i, j);
                i++;
                j--;
                while (compare(arr[i], t) < 0) i++;
                while (compare(arr[j], t) > 0) j--;
            }
            if (compare(arr[left], t) === 0) Quickselect.swap(arr, left, j);
            else {
                j++;
                Quickselect.swap(arr, j, right);
            }
            if (j <= k) left = j + 1;
            if (k <= j) right = j - 1;
        }
    }

    static swap(arr, i, j) {
        let tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }

    static defaultCompare(a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
    }
}

export {quickselect}
