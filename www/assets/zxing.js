(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ZXing = {}));
  }(this, (function (exports) { 'use strict';
  
    function fixProto(target, prototype) {
      var setPrototypeOf = Object.setPrototypeOf;
      setPrototypeOf ? setPrototypeOf(target, prototype) : target.__proto__ = prototype;
    }
    function fixStack(target, fn) {
      if (fn === void 0) {
        fn = target.constructor;
      }
  
      var captureStackTrace = Error.captureStackTrace;
      captureStackTrace && captureStackTrace(target, fn);
    }
  
    var __extends =  function () {
      var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (d, b) {
          d.__proto__ = b;
        } || function (d, b) {
          for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } }
        };
  
        return extendStatics(d, b);
      };
  
      return function (d, b) {
        extendStatics(d, b);
  
        function __() {
          this.constructor = d;
        }
  
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
  
    var CustomError = function (_super) {
      __extends(CustomError, _super);
  
      function CustomError(message) {
        var _newTarget = this.constructor;
  
        var _this = _super.call(this, message) || this;
  
        Object.defineProperty(_this, 'name', {
          value: _newTarget.name,
          enumerable: false,
          configurable: true
        });
        fixProto(_this, _newTarget.prototype);
        fixStack(_this);
        return _this;
      }
  
      return CustomError;
    }(Error);
  
    /**
     * Custom Error class of type Exception.
     */
    class Exception extends CustomError {
        /**
         * Allows Exception to be constructed directly
         * with some message and prototype definition.
         */
        constructor(message = undefined) {
            super(message);
            this.message = message;
        }
        getKind() {
            const ex = this.constructor;
            return ex.kind;
        }
    }
    /**
     * It's typed as string so it can be extended and overriden.
     */
    Exception.kind = 'Exception';
  
    /**
     * Custom Error class of type Exception.
     */
    class ArgumentException extends Exception {
    }
    ArgumentException.kind = 'ArgumentException';
  
    /**
     * Custom Error class of type Exception.
     */
    class IllegalArgumentException extends Exception {
    }
    IllegalArgumentException.kind = 'IllegalArgumentException';
  
    /*
     * Copyright 2009 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    class BinaryBitmap {
        constructor(binarizer) {
            this.binarizer = binarizer;
            if (binarizer === null) {
                throw new IllegalArgumentException('Binarizer must be non-null.');
            }
        }
        /**
         * @return The width of the bitmap.
         */
        getWidth() {
            return this.binarizer.getWidth();
        }
        /**
         * @return The height of the bitmap.
         */
        getHeight() {
            return this.binarizer.getHeight();
        }
        /**
         * Converts one row of luminance data to 1 bit data. May actually do the conversion, or return
         * cached data. Callers should assume this method is expensive and call it as seldom as possible.
         * This method is intended for decoding 1D barcodes and may choose to apply sharpening.
         *
         * @param y The row to fetch, which must be in [0, bitmap height)
         * @param row An optional preallocated array. If null or too small, it will be ignored.
         *            If used, the Binarizer will call BitArray.clear(). Always use the returned object.
         * @return The array of bits for this row (true means black).
         * @throws NotFoundException if row can't be binarized
         */
        getBlackRow(y /*int*/, row) {
            return this.binarizer.getBlackRow(y, row);
        }
        /**
         * Converts a 2D array of luminance data to 1 bit. As above, assume this method is expensive
         * and do not call it repeatedly. This method is intended for decoding 2D barcodes and may or
         * may not apply sharpening. Therefore, a row from this matrix may not be identical to one
         * fetched using getBlackRow(), so don't mix and match between them.
         *
         * @return The 2D array of bits for the image (true means black).
         * @throws NotFoundException if image can't be binarized to make a matrix
         */
        getBlackMatrix() {
            // The matrix is created on demand the first time it is requested, then cached. There are two
            // reasons for this:
            // 1. This work will never be done if the caller only installs 1D Reader objects, or if a
            //    1D Reader finds a barcode before the 2D Readers run.
            // 2. This work will only be done once even if the caller installs multiple 2D Readers.
            if (this.matrix === null || this.matrix === undefined) {
                this.matrix = this.binarizer.getBlackMatrix();
            }
            return this.matrix;
        }
        /**
         * @return Whether this bitmap can be cropped.
         */
        isCropSupported() {
            return this.binarizer.getLuminanceSource().isCropSupported();
        }
        /**
         * Returns a new object with cropped image data. Implementations may keep a reference to the
         * original data rather than a copy. Only callable if isCropSupported() is true.
         *
         * @param left The left coordinate, which must be in [0,getWidth())
         * @param top The top coordinate, which must be in [0,getHeight())
         * @param width The width of the rectangle to crop.
         * @param height The height of the rectangle to crop.
         * @return A cropped version of this object.
         */
        crop(left /*int*/, top /*int*/, width /*int*/, height /*int*/) {
            const newSource = this.binarizer.getLuminanceSource().crop(left, top, width, height);
            return new BinaryBitmap(this.binarizer.createBinarizer(newSource));
        }
        /**
         * @return Whether this bitmap supports counter-clockwise rotation.
         */
        isRotateSupported() {
            return this.binarizer.getLuminanceSource().isRotateSupported();
        }
        /**
         * Returns a new object with rotated image data by 90 degrees counterclockwise.
         * Only callable if {@link #isRotateSupported()} is true.
         *
         * @return A rotated version of this object.
         */
        rotateCounterClockwise() {
            const newSource = this.binarizer.getLuminanceSource().rotateCounterClockwise();
            return new BinaryBitmap(this.binarizer.createBinarizer(newSource));
        }
        /**
         * Returns a new object with rotated image data by 45 degrees counterclockwise.
         * Only callable if {@link #isRotateSupported()} is true.
         *
         * @return A rotated version of this object.
         */
        rotateCounterClockwise45() {
            const newSource = this.binarizer.getLuminanceSource().rotateCounterClockwise45();
            return new BinaryBitmap(this.binarizer.createBinarizer(newSource));
        }
        /*@Override*/
        toString() {
            try {
                return this.getBlackMatrix().toString();
            }
            catch (e /*: NotFoundException*/) {
                return '';
            }
        }
    }
  
    /**
     * Custom Error class of type Exception.
     */
    class ChecksumException extends Exception {
        static getChecksumInstance() {
            return new ChecksumException();
        }
    }
    ChecksumException.kind = 'ChecksumException';
  
    /*
     * Copyright 2009 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * This class hierarchy provides a set of methods to convert luminance data to 1 bit data.
     * It allows the algorithm to vary polymorphically, for example allowing a very expensive
     * thresholding technique for servers and a fast one for mobile. It also permits the implementation
     * to vary, e.g. a JNI version for Android and a Java fallback version for other platforms.
     *
     * @author dswitkin@google.com (Daniel Switkin)
     */
    class Binarizer {
        constructor(source) {
            this.source = source;
        }
        getLuminanceSource() {
            return this.source;
        }
        getWidth() {
            return this.source.getWidth();
        }
        getHeight() {
            return this.source.getHeight();
        }
    }
  
    class System {
        // public static void arraycopy(Object src, int srcPos, Object dest, int destPos, int length)
        /**
         * Makes a copy of a array.
         */
        static arraycopy(src, srcPos, dest, destPos, length) {
            // TODO: better use split or set?
            while (length--) {
                dest[destPos++] = src[srcPos++];
            }
        }
        /**
         * Returns the current time in milliseconds.
         */
        static currentTimeMillis() {
            return Date.now();
        }
    }
  
    /**
     * Custom Error class of type Exception.
     */
    class IndexOutOfBoundsException extends Exception {
    }
    IndexOutOfBoundsException.kind = 'IndexOutOfBoundsException';
  
    /**
     * Custom Error class of type Exception.
     */
    class ArrayIndexOutOfBoundsException extends IndexOutOfBoundsException {
        constructor(index = undefined, message = undefined) {
            super(message);
            this.index = index;
            this.message = message;
        }
    }
    ArrayIndexOutOfBoundsException.kind = 'ArrayIndexOutOfBoundsException';
  
    class Arrays {
        /**
         * Assigns the specified int value to each element of the specified array
         * of ints.
         *
         * @param a the array to be filled
         * @param val the value to be stored in all elements of the array
         */
        static fill(a, val) {
            for (let i = 0, len = a.length; i < len; i++)
                a[i] = val;
        }
        /**
         * Assigns the specified int value to each element of the specified
         * range of the specified array of ints.  The range to be filled
         * extends from index {@code fromIndex}, inclusive, to index
         * {@code toIndex}, exclusive.  (If {@code fromIndex==toIndex}, the
         * range to be filled is empty.)
         *
         * @param a the array to be filled
         * @param fromIndex the index of the first element (inclusive) to be
         *        filled with the specified value
         * @param toIndex the index of the last element (exclusive) to be
         *        filled with the specified value
         * @param val the value to be stored in all elements of the array
         * @throws IllegalArgumentException if {@code fromIndex > toIndex}
         * @throws ArrayIndexOutOfBoundsException if {@code fromIndex < 0} or
         *         {@code toIndex > a.length}
         */
        static fillWithin(a, fromIndex, toIndex, val) {
            Arrays.rangeCheck(a.length, fromIndex, toIndex);
            for (let i = fromIndex; i < toIndex; i++)
                a[i] = val;
        }
        /**
         * Checks that {@code fromIndex} and {@code toIndex} are in
         * the range and throws an exception if they aren't.
         */
        static rangeCheck(arrayLength, fromIndex, toIndex) {
            if (fromIndex > toIndex) {
                throw new IllegalArgumentException('fromIndex(' + fromIndex + ') > toIndex(' + toIndex + ')');
            }
            if (fromIndex < 0) {
                throw new ArrayIndexOutOfBoundsException(fromIndex);
            }
            if (toIndex > arrayLength) {
                throw new ArrayIndexOutOfBoundsException(toIndex);
            }
        }
        static asList(...args) {
            return args;
        }
        static create(rows, cols, value) {
            let arr = Array.from({ length: rows });
            return arr.map(x => Array.from({ length: cols }).fill(value));
        }
        static createInt32Array(rows, cols, value) {
            let arr = Array.from({ length: rows });
            return arr.map(x => Int32Array.from({ length: cols }).fill(value));
        }
        static equals(first, second) {
            if (!first) {
                return false;
            }
            if (!second) {
                return false;
            }
            if (!first.length) {
                return false;
            }
            if (!second.length) {
                return false;
            }
            if (first.length !== second.length) {
                return false;
            }
            for (let i = 0, length = first.length; i < length; i++) {
                if (first[i] !== second[i]) {
                    return false;
                }
            }
            return true;
        }
        static hashCode(a) {
            if (a === null) {
                return 0;
            }
            let result = 1;
            for (const element of a) {
                result = 31 * result + element;
            }
            return result;
        }
        static fillUint8Array(a, value) {
            for (let i = 0; i !== a.length; i++) {
                a[i] = value;
            }
        }
        static copyOf(original, newLength) {
            return original.slice(0, newLength);
        }
        static copyOfUint8Array(original, newLength) {
            if (original.length <= newLength) {
                const newArray = new Uint8Array(newLength);
                newArray.set(original);
                return newArray;
            }
            return original.slice(0, newLength);
        }
        static copyOfRange(original, from, to) {
            const newLength = to - from;
            const copy = new Int32Array(newLength);
            System.arraycopy(original, from, copy, 0, newLength);
            return copy;
        }
        /*
        * Returns the index of of the element in a sorted array or (-n-1) where n is the insertion point
        * for the new element.
        * Parameters:
        *     ar - A sorted array
        *     el - An element to search for
        *     comparator - A comparator function. The function takes two arguments: (a, b) and returns:
        *        a negative number  if a is less than b;
        *        0 if a is equal to b;
        *        a positive number of a is greater than b.
        * The array may contain duplicate elements. If there are more than one equal elements in the array,
        * the returned value can be the index of any one of the equal elements.
        *
        * http://jsfiddle.net/aryzhov/pkfst550/
        */
        static binarySearch(ar, el, comparator) {
            if (undefined === comparator) {
                comparator = Arrays.numberComparator;
            }
            let m = 0;
            let n = ar.length - 1;
            while (m <= n) {
                const k = (n + m) >> 1;
                const cmp = comparator(el, ar[k]);
                if (cmp > 0) {
                    m = k + 1;
                }
                else if (cmp < 0) {
                    n = k - 1;
                }
                else {
                    return k;
                }
            }
            return -m - 1;
        }
        static numberComparator(a, b) {
            return a - b;
        }
    }
  
    /**
     * Ponyfill for Java's Integer class.
     */
    class Integer {
        static numberOfTrailingZeros(i) {
            let y;
            if (i === 0)
                return 32;
            let n = 31;
            y = i << 16;
            if (y !== 0) {
                n -= 16;
                i = y;
            }
            y = i << 8;
            if (y !== 0) {
                n -= 8;
                i = y;
            }
            y = i << 4;
            if (y !== 0) {
                n -= 4;
                i = y;
            }
            y = i << 2;
            if (y !== 0) {
                n -= 2;
                i = y;
            }
            return n - ((i << 1) >>> 31);
        }
        static numberOfLeadingZeros(i) {
            // HD, Figure 5-6
            if (i === 0) {
                return 32;
            }
            let n = 1;
            if (i >>> 16 === 0) {
                n += 16;
                i <<= 16;
            }
            if (i >>> 24 === 0) {
                n += 8;
                i <<= 8;
            }
            if (i >>> 28 === 0) {
                n += 4;
                i <<= 4;
            }
            if (i >>> 30 === 0) {
                n += 2;
                i <<= 2;
            }
            n -= i >>> 31;
            return n;
        }
        static toHexString(i) {
            return i.toString(16);
        }
        static toBinaryString(intNumber) {
            return String(parseInt(String(intNumber), 2));
        }
        // Returns the number of one-bits in the two's complement binary representation of the specified int value. This function is sometimes referred to as the population count.
        // Returns:
        // the number of one-bits in the two's complement binary representation of the specified int value.
        static bitCount(i) {
            // HD, Figure 5-2
            i = i - ((i >>> 1) & 0x55555555);
            i = (i & 0x33333333) + ((i >>> 2) & 0x33333333);
            i = (i + (i >>> 4)) & 0x0f0f0f0f;
            i = i + (i >>> 8);
            i = i + (i >>> 16);
            return i & 0x3f;
        }
        static truncDivision(dividend, divisor) {
            return Math.trunc(dividend / divisor);
        }
        /**
         * Converts A string to an integer.
         * @param s A string to convert into a number.
         * @param radix A value between 2 and 36 that specifies the base of the number in numString. If this argument is not supplied, strings with a prefix of '0x' are considered hexadecimal. All other strings are considered decimal.
         */
        static parseInt(num, radix = undefined) {
            return parseInt(num, radix);
        }
    }
    Integer.MIN_VALUE_32_BITS = -2147483648;
    Integer.MAX_VALUE = Number.MAX_SAFE_INTEGER;
  
    /*
     * Copyright 2007 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * <p>A simple, fast array of bits, represented compactly by an array of ints internally.</p>
     *
     * @author Sean Owen
     */
    class BitArray /*implements Cloneable*/ {
        // public constructor() {
        //   this.size = 0
        //   this.bits = new Int32Array(1)
        // }
        // public constructor(size?: number /*int*/) {
        //   if (undefined === size) {
        //     this.size = 0
        //   } else {
        //     this.size = size
        //   }
        //   this.bits = this.makeArray(size)
        // }
        // For testing only
        constructor(size /*int*/, bits) {
            if (undefined === size) {
                this.size = 0;
                this.bits = new Int32Array(1);
            }
            else {
                this.size = size;
                if (undefined === bits || null === bits) {
                    this.bits = BitArray.makeArray(size);
                }
                else {
                    this.bits = bits;
                }
            }
        }
        getSize() {
            return this.size;
        }
        getSizeInBytes() {
            return Math.floor((this.size + 7) / 8);
        }
        ensureCapacity(size /*int*/) {
            if (size > this.bits.length * 32) {
                const newBits = BitArray.makeArray(size);
                System.arraycopy(this.bits, 0, newBits, 0, this.bits.length);
                this.bits = newBits;
            }
        }
        /**
         * @param i bit to get
         * @return true iff bit i is set
         */
        get(i /*int*/) {
            return (this.bits[Math.floor(i / 32)] & (1 << (i & 0x1F))) !== 0;
        }
        /**
         * Sets bit i.
         *
         * @param i bit to set
         */
        set(i /*int*/) {
            this.bits[Math.floor(i / 32)] |= 1 << (i & 0x1F);
        }
        /**
         * Flips bit i.
         *
         * @param i bit to set
         */
        flip(i /*int*/) {
            this.bits[Math.floor(i / 32)] ^= 1 << (i & 0x1F);
        }
        /**
         * @param from first bit to check
         * @return index of first bit that is set, starting from the given index, or size if none are set
         *  at or beyond this given index
         * @see #getNextUnset(int)
         */
        getNextSet(from /*int*/) {
            const size = this.size;
            if (from >= size) {
                return size;
            }
            const bits = this.bits;
            let bitsOffset = Math.floor(from / 32);
            let currentBits = bits[bitsOffset];
            // mask off lesser bits first
            currentBits &= ~((1 << (from & 0x1F)) - 1);
            const length = bits.length;
            while (currentBits === 0) {
                if (++bitsOffset === length) {
                    return size;
                }
                currentBits = bits[bitsOffset];
            }
            const result = (bitsOffset * 32) + Integer.numberOfTrailingZeros(currentBits);
            return result > size ? size : result;
        }
        /**
         * @param from index to start looking for unset bit
         * @return index of next unset bit, or {@code size} if none are unset until the end
         * @see #getNextSet(int)
         */
        getNextUnset(from /*int*/) {
            const size = this.size;
            if (from >= size) {
                return size;
            }
            const bits = this.bits;
            let bitsOffset = Math.floor(from / 32);
            let currentBits = ~bits[bitsOffset];
            // mask off lesser bits first
            currentBits &= ~((1 << (from & 0x1F)) - 1);
            const length = bits.length;
            while (currentBits === 0) {
                if (++bitsOffset === length) {
                    return size;
                }
                currentBits = ~bits[bitsOffset];
            }
            const result = (bitsOffset * 32) + Integer.numberOfTrailingZeros(currentBits);
            return result > size ? size : result;
        }
        /**
         * Sets a block of 32 bits, starting at bit i.
         *
         * @param i first bit to set
         * @param newBits the new value of the next 32 bits. Note again that the least-significant bit
         * corresponds to bit i, the next-least-significant to i+1, and so on.
         */
        setBulk(i /*int*/, newBits /*int*/) {
            this.bits[Math.floor(i / 32)] = newBits;
        }
        /**
         * Sets a range of bits.
         *
         * @param start start of range, inclusive.
         * @param end end of range, exclusive
         */
        setRange(start /*int*/, end /*int*/) {
            if (end < start || start < 0 || end > this.size) {
                throw new IllegalArgumentException();
            }
            if (end === start) {
                return;
            }
            end--; // will be easier to treat this as the last actually set bit -- inclusive
            const firstInt = Math.floor(start / 32);
            const lastInt = Math.floor(end / 32);
            const bits = this.bits;
            for (let i = firstInt; i <= lastInt; i++) {
                const firstBit = i > firstInt ? 0 : start & 0x1F;
                const lastBit = i < lastInt ? 31 : end & 0x1F;
                // Ones from firstBit to lastBit, inclusive
                const mask = (2 << lastBit) - (1 << firstBit);
                bits[i] |= mask;
            }
        }
        /**
         * Clears all bits (sets to false).
         */
        clear() {
            const max = this.bits.length;
            const bits = this.bits;
            for (let i = 0; i < max; i++) {
                bits[i] = 0;
            }
        }
        /**
         * Efficient method to check if a range of bits is set, or not set.
         *
         * @param start start of range, inclusive.
         * @param end end of range, exclusive
         * @param value if true, checks that bits in range are set, otherwise checks that they are not set
         * @return true iff all bits are set or not set in range, according to value argument
         * @throws IllegalArgumentException if end is less than start or the range is not contained in the array
         */
        isRange(start /*int*/, end /*int*/, value) {
            if (end < start || start < 0 || end > this.size) {
                throw new IllegalArgumentException();
            }
            if (end === start) {
                return true; // empty range matches
            }
            end--; // will be easier to treat this as the last actually set bit -- inclusive
            const firstInt = Math.floor(start / 32);
            const lastInt = Math.floor(end / 32);
            const bits = this.bits;
            for (let i = firstInt; i <= lastInt; i++) {
                const firstBit = i > firstInt ? 0 : start & 0x1F;
                const lastBit = i < lastInt ? 31 : end & 0x1F;
                // Ones from firstBit to lastBit, inclusive
                const mask = (2 << lastBit) - (1 << firstBit) & 0xFFFFFFFF;
                // TYPESCRIPTPORT: & 0xFFFFFFFF added to discard anything after 32 bits, as ES has 53 bits
                // Return false if we're looking for 1s and the masked bits[i] isn't all 1s (is: that,
                // equals the mask, or we're looking for 0s and the masked portion is not all 0s
                if ((bits[i] & mask) !== (value ? mask : 0)) {
                    return false;
                }
            }
            return true;
        }
        appendBit(bit) {
            this.ensureCapacity(this.size + 1);
            if (bit) {
                this.bits[Math.floor(this.size / 32)] |= 1 << (this.size & 0x1F);
            }
            this.size++;
        }
        /**
         * Appends the least-significant bits, from value, in order from most-significant to
         * least-significant. For example, appending 6 bits from 0x000001E will append the bits
         * 0, 1, 1, 1, 1, 0 in that order.
         *
         * @param value {@code int} containing bits to append
         * @param numBits bits from value to append
         */
        appendBits(value /*int*/, numBits /*int*/) {
            if (numBits < 0 || numBits > 32) {
                throw new IllegalArgumentException('Num bits must be between 0 and 32');
            }
            this.ensureCapacity(this.size + numBits);
            // const appendBit = this.appendBit;
            for (let numBitsLeft = numBits; numBitsLeft > 0; numBitsLeft--) {
                this.appendBit(((value >> (numBitsLeft - 1)) & 0x01) === 1);
            }
        }
        appendBitArray(other) {
            const otherSize = other.size;
            this.ensureCapacity(this.size + otherSize);
            // const appendBit = this.appendBit;
            for (let i = 0; i < otherSize; i++) {
                this.appendBit(other.get(i));
            }
        }
        xor(other) {
            if (this.size !== other.size) {
                throw new IllegalArgumentException('Sizes don\'t match');
            }
            const bits = this.bits;
            for (let i = 0, length = bits.length; i < length; i++) {
                // The last int could be incomplete (i.e. not have 32 bits in
                // it) but there is no problem since 0 XOR 0 == 0.
                bits[i] ^= other.bits[i];
            }
        }
        /**
         *
         * @param bitOffset first bit to start writing
         * @param array array to write into. Bytes are written most-significant byte first. This is the opposite
         *  of the internal representation, which is exposed by {@link #getBitArray()}
         * @param offset position in array to start writing
         * @param numBytes how many bytes to write
         */
        toBytes(bitOffset /*int*/, array, offset /*int*/, numBytes /*int*/) {
            for (let i = 0; i < numBytes; i++) {
                let theByte = 0;
                for (let j = 0; j < 8; j++) {
                    if (this.get(bitOffset)) {
                        theByte |= 1 << (7 - j);
                    }
                    bitOffset++;
                }
                array[offset + i] = /*(byte)*/ theByte;
            }
        }
        /**
         * @return underlying array of ints. The first element holds the first 32 bits, and the least
         *         significant bit is bit 0.
         */
        getBitArray() {
            return this.bits;
        }
        /**
         * Reverses all bits in the array.
         */
        reverse() {
            const newBits = new Int32Array(this.bits.length);
            // reverse all int's first
            const len = Math.floor((this.size - 1) / 32);
            const oldBitsLen = len + 1;
            const bits = this.bits;
            for (let i = 0; i < oldBitsLen; i++) {
                let x = bits[i];
                x = ((x >> 1) & 0x55555555) | ((x & 0x55555555) << 1);
                x = ((x >> 2) & 0x33333333) | ((x & 0x33333333) << 2);
                x = ((x >> 4) & 0x0f0f0f0f) | ((x & 0x0f0f0f0f) << 4);
                x = ((x >> 8) & 0x00ff00ff) | ((x & 0x00ff00ff) << 8);
                x = ((x >> 16) & 0x0000ffff) | ((x & 0x0000ffff) << 16);
                newBits[len - i] = /*(int)*/ x;
            }
            // now correct the int's if the bit size isn't a multiple of 32
            if (this.size !== oldBitsLen * 32) {
                const leftOffset = oldBitsLen * 32 - this.size;
                let currentInt = newBits[0] >>> leftOffset;
                for (let i = 1; i < oldBitsLen; i++) {
                    const nextInt = newBits[i];
                    currentInt |= nextInt << (32 - leftOffset);
                    newBits[i - 1] = currentInt;
                    currentInt = nextInt >>> leftOffset;
                }
                newBits[oldBitsLen - 1] = currentInt;
            }
            this.bits = newBits;
        }
        static makeArray(size /*int*/) {
            return new Int32Array(Math.floor((size + 31) / 32));
        }
        /*@Override*/
        equals(o) {
            if (!(o instanceof BitArray)) {
                return false;
            }
            const other = o;
            return this.size === other.size && Arrays.equals(this.bits, other.bits);
        }
        /*@Override*/
        hashCode() {
            return 31 * this.size + Arrays.hashCode(this.bits);
        }
        /*@Override*/
        toString() {
            let result = '';
            for (let i = 0, size = this.size; i < size; i++) {
                if ((i & 0x07) === 0) {
                    result += ' ';
                }
                result += this.get(i) ? 'X' : '.';
            }
            return result;
        }
        /*@Override*/
        clone() {
            return new BitArray(this.size, this.bits.slice());
        }
    }
  
    /*
     * Copyright 2009 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /*namespace com.google.zxing {*/
    /**
     * Encapsulates a type of hint that a caller may pass to a barcode reader to help it
     * more quickly or accurately decode it. It is up to implementations to decide what,
     * if anything, to do with the information that is supplied.
     *
     * @author Sean Owen
     * @author dswitkin@google.com (Daniel Switkin)
     * @see Reader#decode(BinaryBitmap,java.util.Map)
     */
    var DecodeHintType;
    (function (DecodeHintType) {
        /**
         * Unspecified, application-specific hint. Maps to an unspecified {@link Object}.
         */
        DecodeHintType[DecodeHintType["OTHER"] = 0] = "OTHER"; /*(Object.class)*/
        /**
         * Image is a pure monochrome image of a barcode. Doesn't matter what it maps to;
         * use {@link Boolean#TRUE}.
         */
        DecodeHintType[DecodeHintType["PURE_BARCODE"] = 1] = "PURE_BARCODE"; /*(Void.class)*/
        /**
         * Image is known to be of one of a few possible formats.
         * Maps to a {@link List} of {@link BarcodeFormat}s.
         */
        DecodeHintType[DecodeHintType["POSSIBLE_FORMATS"] = 2] = "POSSIBLE_FORMATS"; /*(List.class)*/
        /**
         * Spend more time to try to find a barcode; optimize for accuracy, not speed.
         * Doesn't matter what it maps to; use {@link Boolean#TRUE}.
         */
        DecodeHintType[DecodeHintType["TRY_HARDER"] = 3] = "TRY_HARDER"; /*(Void.class)*/
        /**
         * Specifies what character encoding to use when decoding, where applicable (type String)
         */
        DecodeHintType[DecodeHintType["CHARACTER_SET"] = 4] = "CHARACTER_SET"; /*(String.class)*/
        /**
         * Allowed lengths of encoded data -- reject anything else. Maps to an {@code Int32Array}.
         */
        DecodeHintType[DecodeHintType["ALLOWED_LENGTHS"] = 5] = "ALLOWED_LENGTHS"; /*(Int32Array.class)*/
        /**
         * Assume Code 39 codes employ a check digit. Doesn't matter what it maps to;
         * use {@link Boolean#TRUE}.
         */
        DecodeHintType[DecodeHintType["ASSUME_CODE_39_CHECK_DIGIT"] = 6] = "ASSUME_CODE_39_CHECK_DIGIT"; /*(Void.class)*/
        /**
         * Assume the barcode is being processed as a GS1 barcode, and modify behavior as needed.
         * For example this affects FNC1 handling for Code 128 (aka GS1-128). Doesn't matter what it maps to;
         * use {@link Boolean#TRUE}.
         */
        DecodeHintType[DecodeHintType["ASSUME_GS1"] = 7] = "ASSUME_GS1"; /*(Void.class)*/
        /**
         * If true, return the start and end digits in a Codabar barcode instead of stripping them. They
         * are alpha, whereas the rest are numeric. By default, they are stripped, but this causes them
         * to not be. Doesn't matter what it maps to; use {@link Boolean#TRUE}.
         */
        DecodeHintType[DecodeHintType["RETURN_CODABAR_START_END"] = 8] = "RETURN_CODABAR_START_END"; /*(Void.class)*/
        /**
         * The caller needs to be notified via callback when a possible {@link ResultPoint}
         * is found. Maps to a {@link ResultPointCallback}.
         */
        DecodeHintType[DecodeHintType["NEED_RESULT_POINT_CALLBACK"] = 9] = "NEED_RESULT_POINT_CALLBACK"; /*(ResultPointCallback.class)*/
        /**
         * Allowed extension lengths for EAN or UPC barcodes. Other formats will ignore this.
         * Maps to an {@code Int32Array} of the allowed extension lengths, for example [2], [5], or [2, 5].
         * If it is optional to have an extension, do not set this hint. If this is set,
         * and a UPC or EAN barcode is found but an extension is not, then no result will be returned
         * at all.
         */
        DecodeHintType[DecodeHintType["ALLOWED_EAN_EXTENSIONS"] = 10] = "ALLOWED_EAN_EXTENSIONS"; /*(Int32Array.class)*/
        // End of enumeration values.
        /**
         * Data type the hint is expecting.
         * Among the possible values the {@link Void} stands out as being used for
         * hints that do not expect a value to be supplied (flag hints). Such hints
         * will possibly have their value ignored, or replaced by a
         * {@link Boolean#TRUE}. Hint suppliers should probably use
         * {@link Boolean#TRUE} as directed by the actual hint documentation.
         */
        // private valueType: Class<?>
        // DecodeHintType(valueType: Class<?>) {
        //   this.valueType = valueType
        // }
        // public getValueType(): Class<?> {
        //   return valueType
        // }
    })(DecodeHintType || (DecodeHintType = {}));
    var DecodeHintType$1 = DecodeHintType;
  
    /**
     * Custom Error class of type Exception.
     */
    class FormatException extends Exception {
        static getFormatInstance() {
            return new FormatException();
        }
    }
    FormatException.kind = 'FormatException';
  
    /*
     * Copyright 2008 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /*import java.util.HashMap;*/
    /*import java.util.Map;*/
    var CharacterSetValueIdentifiers;
    (function (CharacterSetValueIdentifiers) {
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["Cp437"] = 0] = "Cp437";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["ISO8859_1"] = 1] = "ISO8859_1";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["ISO8859_2"] = 2] = "ISO8859_2";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["ISO8859_3"] = 3] = "ISO8859_3";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["ISO8859_4"] = 4] = "ISO8859_4";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["ISO8859_5"] = 5] = "ISO8859_5";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["ISO8859_6"] = 6] = "ISO8859_6";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["ISO8859_7"] = 7] = "ISO8859_7";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["ISO8859_8"] = 8] = "ISO8859_8";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["ISO8859_9"] = 9] = "ISO8859_9";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["ISO8859_10"] = 10] = "ISO8859_10";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["ISO8859_11"] = 11] = "ISO8859_11";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["ISO8859_13"] = 12] = "ISO8859_13";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["ISO8859_14"] = 13] = "ISO8859_14";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["ISO8859_15"] = 14] = "ISO8859_15";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["ISO8859_16"] = 15] = "ISO8859_16";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["SJIS"] = 16] = "SJIS";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["Cp1250"] = 17] = "Cp1250";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["Cp1251"] = 18] = "Cp1251";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["Cp1252"] = 19] = "Cp1252";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["Cp1256"] = 20] = "Cp1256";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["UnicodeBigUnmarked"] = 21] = "UnicodeBigUnmarked";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["UTF8"] = 22] = "UTF8";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["ASCII"] = 23] = "ASCII";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["Big5"] = 24] = "Big5";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["GB18030"] = 25] = "GB18030";
        CharacterSetValueIdentifiers[CharacterSetValueIdentifiers["EUC_KR"] = 26] = "EUC_KR";
    })(CharacterSetValueIdentifiers || (CharacterSetValueIdentifiers = {}));
    /**
     * Encapsulates a Character Set ECI, according to "Extended Channel Interpretations" 5.3.1.1
     * of ISO 18004.
     *
     * @author Sean Owen
     */
    class CharacterSetECI {
        constructor(valueIdentifier, valuesParam, name, ...otherEncodingNames) {
            this.valueIdentifier = valueIdentifier;
            this.name = name;
            if (typeof valuesParam === 'number') {
                this.values = Int32Array.from([valuesParam]);
            }
            else {
                this.values = valuesParam;
            }
            this.otherEncodingNames = otherEncodingNames;
            CharacterSetECI.VALUE_IDENTIFIER_TO_ECI.set(valueIdentifier, this);
            CharacterSetECI.NAME_TO_ECI.set(name, this);
            const values = this.values;
            for (let i = 0, length = values.length; i !== length; i++) {
                const v = values[i];
                CharacterSetECI.VALUES_TO_ECI.set(v, this);
            }
            for (const otherName of otherEncodingNames) {
                CharacterSetECI.NAME_TO_ECI.set(otherName, this);
            }
        }
        // CharacterSetECI(value: number /*int*/) {
        //   this(new Int32Array {value})
        // }
        // CharacterSetECI(value: number /*int*/, String... otherEncodingNames) {
        //   this.values = new Int32Array {value}
        //   this.otherEncodingNames = otherEncodingNames
        // }
        // CharacterSetECI(values: Int32Array, String... otherEncodingNames) {
        //   this.values = values
        //   this.otherEncodingNames = otherEncodingNames
        // }
        getValueIdentifier() {
            return this.valueIdentifier;
        }
        getName() {
            return this.name;
        }
        getValue() {
            return this.values[0];
        }
        /**
         * @param value character set ECI value
         * @return {@code CharacterSetECI} representing ECI of given value, or null if it is legal but
         *   unsupported
         * @throws FormatException if ECI value is invalid
         */
        static getCharacterSetECIByValue(value /*int*/) {
            if (value < 0 || value >= 900) {
                throw new FormatException('incorect value');
            }
            const characterSet = CharacterSetECI.VALUES_TO_ECI.get(value);
            if (undefined === characterSet) {
                throw new FormatException('incorect value');
            }
            return characterSet;
        }
        /**
         * @param name character set ECI encoding name
         * @return CharacterSetECI representing ECI for character encoding, or null if it is legal
         *   but unsupported
         */
        static getCharacterSetECIByName(name) {
            const characterSet = CharacterSetECI.NAME_TO_ECI.get(name);
            if (undefined === characterSet) {
                throw new FormatException('incorect value');
            }
            return characterSet;
        }
        equals(o) {
            if (!(o instanceof CharacterSetECI)) {
                return false;
            }
            const other = o;
            return this.getName() === other.getName();
        }
    }
    CharacterSetECI.VALUE_IDENTIFIER_TO_ECI = new Map();
    CharacterSetECI.VALUES_TO_ECI = new Map();
    CharacterSetECI.NAME_TO_ECI = new Map();
    // Enum name is a Java encoding valid for java.lang and java.io
    // TYPESCRIPTPORT: changed the main label for ISO as the TextEncoder did not recognized them in the form from java
    // (eg ISO8859_1 must be ISO88591 or ISO8859-1 or ISO-8859-1)
    // later on: well, except 16 wich does not work with ISO885916 so used ISO-8859-1 form for default
    CharacterSetECI.Cp437 = new CharacterSetECI(CharacterSetValueIdentifiers.Cp437, Int32Array.from([0, 2]), 'Cp437');
    CharacterSetECI.ISO8859_1 = new CharacterSetECI(CharacterSetValueIdentifiers.ISO8859_1, Int32Array.from([1, 3]), 'ISO-8859-1', 'ISO88591', 'ISO8859_1');
    CharacterSetECI.ISO8859_2 = new CharacterSetECI(CharacterSetValueIdentifiers.ISO8859_2, 4, 'ISO-8859-2', 'ISO88592', 'ISO8859_2');
    CharacterSetECI.ISO8859_3 = new CharacterSetECI(CharacterSetValueIdentifiers.ISO8859_3, 5, 'ISO-8859-3', 'ISO88593', 'ISO8859_3');
    CharacterSetECI.ISO8859_4 = new CharacterSetECI(CharacterSetValueIdentifiers.ISO8859_4, 6, 'ISO-8859-4', 'ISO88594', 'ISO8859_4');
    CharacterSetECI.ISO8859_5 = new CharacterSetECI(CharacterSetValueIdentifiers.ISO8859_5, 7, 'ISO-8859-5', 'ISO88595', 'ISO8859_5');
    CharacterSetECI.ISO8859_6 = new CharacterSetECI(CharacterSetValueIdentifiers.ISO8859_6, 8, 'ISO-8859-6', 'ISO88596', 'ISO8859_6');
    CharacterSetECI.ISO8859_7 = new CharacterSetECI(CharacterSetValueIdentifiers.ISO8859_7, 9, 'ISO-8859-7', 'ISO88597', 'ISO8859_7');
    CharacterSetECI.ISO8859_8 = new CharacterSetECI(CharacterSetValueIdentifiers.ISO8859_8, 10, 'ISO-8859-8', 'ISO88598', 'ISO8859_8');
    CharacterSetECI.ISO8859_9 = new CharacterSetECI(CharacterSetValueIdentifiers.ISO8859_9, 11, 'ISO-8859-9', 'ISO88599', 'ISO8859_9');
    CharacterSetECI.ISO8859_10 = new CharacterSetECI(CharacterSetValueIdentifiers.ISO8859_10, 12, 'ISO-8859-10', 'ISO885910', 'ISO8859_10');
    CharacterSetECI.ISO8859_11 = new CharacterSetECI(CharacterSetValueIdentifiers.ISO8859_11, 13, 'ISO-8859-11', 'ISO885911', 'ISO8859_11');
    CharacterSetECI.ISO8859_13 = new CharacterSetECI(CharacterSetValueIdentifiers.ISO8859_13, 15, 'ISO-8859-13', 'ISO885913', 'ISO8859_13');
    CharacterSetECI.ISO8859_14 = new CharacterSetECI(CharacterSetValueIdentifiers.ISO8859_14, 16, 'ISO-8859-14', 'ISO885914', 'ISO8859_14');
    CharacterSetECI.ISO8859_15 = new CharacterSetECI(CharacterSetValueIdentifiers.ISO8859_15, 17, 'ISO-8859-15', 'ISO885915', 'ISO8859_15');
    CharacterSetECI.ISO8859_16 = new CharacterSetECI(CharacterSetValueIdentifiers.ISO8859_16, 18, 'ISO-8859-16', 'ISO885916', 'ISO8859_16');
    CharacterSetECI.SJIS = new CharacterSetECI(CharacterSetValueIdentifiers.SJIS, 20, 'SJIS', 'Shift_JIS');
    CharacterSetECI.Cp1250 = new CharacterSetECI(CharacterSetValueIdentifiers.Cp1250, 21, 'Cp1250', 'windows-1250');
    CharacterSetECI.Cp1251 = new CharacterSetECI(CharacterSetValueIdentifiers.Cp1251, 22, 'Cp1251', 'windows-1251');
    CharacterSetECI.Cp1252 = new CharacterSetECI(CharacterSetValueIdentifiers.Cp1252, 23, 'Cp1252', 'windows-1252');
    CharacterSetECI.Cp1256 = new CharacterSetECI(CharacterSetValueIdentifiers.Cp1256, 24, 'Cp1256', 'windows-1256');
    CharacterSetECI.UnicodeBigUnmarked = new CharacterSetECI(CharacterSetValueIdentifiers.UnicodeBigUnmarked, 25, 'UnicodeBigUnmarked', 'UTF-16BE', 'UnicodeBig');
    CharacterSetECI.UTF8 = new CharacterSetECI(CharacterSetValueIdentifiers.UTF8, 26, 'UTF8', 'UTF-8');
    CharacterSetECI.ASCII = new CharacterSetECI(CharacterSetValueIdentifiers.ASCII, Int32Array.from([27, 170]), 'ASCII', 'US-ASCII');
    CharacterSetECI.Big5 = new CharacterSetECI(CharacterSetValueIdentifiers.Big5, 28, 'Big5');
    CharacterSetECI.GB18030 = new CharacterSetECI(CharacterSetValueIdentifiers.GB18030, 29, 'GB18030', 'GB2312', 'EUC_CN', 'GBK');
    CharacterSetECI.EUC_KR = new CharacterSetECI(CharacterSetValueIdentifiers.EUC_KR, 30, 'EUC_KR', 'EUC-KR');
  
    /**
     * Custom Error class of type Exception.
     */
    class UnsupportedOperationException extends Exception {
    }
    UnsupportedOperationException.kind = 'UnsupportedOperationException';
  
    /**
     * Responsible for en/decoding strings.
     */
    class StringEncoding {
        /**
         * Decodes some Uint8Array to a string format.
         */
        static decode(bytes, encoding) {
            const encodingName = this.encodingName(encoding);
            if (this.customDecoder) {
                return this.customDecoder(bytes, encodingName);
            }
            // Increases browser support.
            if (typeof TextDecoder === 'undefined' || this.shouldDecodeOnFallback(encodingName)) {
                return this.decodeFallback(bytes, encodingName);
            }
            return new TextDecoder(encodingName).decode(bytes);
        }
        /**
         * Checks if the decoding method should use the fallback for decoding
         * once Node TextDecoder doesn't support all encoding formats.
         *
         * @param encodingName
         */
        static shouldDecodeOnFallback(encodingName) {
            return !StringEncoding.isBrowser() && encodingName === 'ISO-8859-1';
        }
        /**
         * Encodes some string into a Uint8Array.
         */
        static encode(s, encoding) {
            const encodingName = this.encodingName(encoding);
            if (this.customEncoder) {
                return this.customEncoder(s, encodingName);
            }
            // Increases browser support.
            if (typeof TextEncoder === 'undefined') {
                return this.encodeFallback(s);
            }
            // TextEncoder only encodes to UTF8 by default as specified by encoding.spec.whatwg.org
            return new TextEncoder().encode(s);
        }
        static isBrowser() {
            return (typeof window !== 'undefined' && {}.toString.call(window) === '[object Window]');
        }
        /**
         * Returns the string value from some encoding character set.
         */
        static encodingName(encoding) {
            return typeof encoding === 'string'
                ? encoding
                : encoding.getName();
        }
        /**
         * Returns character set from some encoding character set.
         */
        static encodingCharacterSet(encoding) {
            if (encoding instanceof CharacterSetECI) {
                return encoding;
            }
            return CharacterSetECI.getCharacterSetECIByName(encoding);
        }
        /**
         * Runs a fallback for the native decoding funcion.
         */
        static decodeFallback(bytes, encoding) {
            const characterSet = this.encodingCharacterSet(encoding);
            if (StringEncoding.isDecodeFallbackSupported(characterSet)) {
                let s = '';
                for (let i = 0, length = bytes.length; i < length; i++) {
                    let h = bytes[i].toString(16);
                    if (h.length < 2) {
                        h = '0' + h;
                    }
                    s += '%' + h;
                }
                return decodeURIComponent(s);
            }
            if (characterSet.equals(CharacterSetECI.UnicodeBigUnmarked)) {
                return String.fromCharCode.apply(null, new Uint16Array(bytes.buffer));
            }
            throw new UnsupportedOperationException(`Encoding ${this.encodingName(encoding)} not supported by fallback.`);
        }
        static isDecodeFallbackSupported(characterSet) {
            return characterSet.equals(CharacterSetECI.UTF8) ||
                characterSet.equals(CharacterSetECI.ISO8859_1) ||
                characterSet.equals(CharacterSetECI.ASCII);
        }
        /**
         * Runs a fallback for the native encoding funcion.
         *
         * @see https://stackoverflow.com/a/17192845/4367683
         */
        static encodeFallback(s) {
            const encodedURIstring = btoa(unescape(encodeURIComponent(s)));
            const charList = encodedURIstring.split('');
            const uintArray = [];
            for (let i = 0; i < charList.length; i++) {
                uintArray.push(charList[i].charCodeAt(0));
            }
            return new Uint8Array(uintArray);
        }
    }
  
    /*
     * Copyright (C) 2010 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Common string-related functions.
     *
     * @author Sean Owen
     * @author Alex Dupre
     */
    class StringUtils {
        // SHIFT_JIS.equalsIgnoreCase(PLATFORM_DEFAULT_ENCODING) ||
        // EUC_JP.equalsIgnoreCase(PLATFORM_DEFAULT_ENCODING);
        static castAsNonUtf8Char(code, encoding = null) {
            // ISO 8859-1 is the Java default as UTF-8 is JavaScripts
            // you can see this method as a Java version of String.fromCharCode
            const e = encoding ? encoding.getName() : this.ISO88591;
            // use passed format (fromCharCode will return UTF8 encoding)
            return StringEncoding.decode(new Uint8Array([code]), e);
        }
        /**
         * @param bytes bytes encoding a string, whose encoding should be guessed
         * @param hints decode hints if applicable
         * @return name of guessed encoding; at the moment will only guess one of:
         *  {@link #SHIFT_JIS}, {@link #UTF8}, {@link #ISO88591}, or the platform
         *  default encoding if none of these can possibly be correct
         */
        static guessEncoding(bytes, hints) {
            if (hints !== null && hints !== undefined && undefined !== hints.get(DecodeHintType$1.CHARACTER_SET)) {
                return hints.get(DecodeHintType$1.CHARACTER_SET).toString();
            }
            // For now, merely tries to distinguish ISO-8859-1, UTF-8 and Shift_JIS,
            // which should be by far the most common encodings.
            const length = bytes.length;
            let canBeISO88591 = true;
            let canBeShiftJIS = true;
            let canBeUTF8 = true;
            let utf8BytesLeft = 0;
            // int utf8LowChars = 0
            let utf2BytesChars = 0;
            let utf3BytesChars = 0;
            let utf4BytesChars = 0;
            let sjisBytesLeft = 0;
            // int sjisLowChars = 0
            let sjisKatakanaChars = 0;
            // int sjisDoubleBytesChars = 0
            let sjisCurKatakanaWordLength = 0;
            let sjisCurDoubleBytesWordLength = 0;
            let sjisMaxKatakanaWordLength = 0;
            let sjisMaxDoubleBytesWordLength = 0;
            // int isoLowChars = 0
            // int isoHighChars = 0
            let isoHighOther = 0;
            const utf8bom = bytes.length > 3 &&
                bytes[0] === /*(byte) */ 0xEF &&
                bytes[1] === /*(byte) */ 0xBB &&
                bytes[2] === /*(byte) */ 0xBF;
            for (let i = 0; i < length && (canBeISO88591 || canBeShiftJIS || canBeUTF8); i++) {
                const value = bytes[i] & 0xFF;
                // UTF-8 stuff
                if (canBeUTF8) {
                    if (utf8BytesLeft > 0) {
                        if ((value & 0x80) === 0) {
                            canBeUTF8 = false;
                        }
                        else {
                            utf8BytesLeft--;
                        }
                    }
                    else if ((value & 0x80) !== 0) {
                        if ((value & 0x40) === 0) {
                            canBeUTF8 = false;
                        }
                        else {
                            utf8BytesLeft++;
                            if ((value & 0x20) === 0) {
                                utf2BytesChars++;
                            }
                            else {
                                utf8BytesLeft++;
                                if ((value & 0x10) === 0) {
                                    utf3BytesChars++;
                                }
                                else {
                                    utf8BytesLeft++;
                                    if ((value & 0x08) === 0) {
                                        utf4BytesChars++;
                                    }
                                    else {
                                        canBeUTF8 = false;
                                    }
                                }
                            }
                        }
                    } // else {
                    // utf8LowChars++
                    // }
                }
                // ISO-8859-1 stuff
                if (canBeISO88591) {
                    if (value > 0x7F && value < 0xA0) {
                        canBeISO88591 = false;
                    }
                    else if (value > 0x9F) {
                        if (value < 0xC0 || value === 0xD7 || value === 0xF7) {
                            isoHighOther++;
                        } // else {
                        // isoHighChars++
                        // }
                    } // else {
                    // isoLowChars++
                    // }
                }
                // Shift_JIS stuff
                if (canBeShiftJIS) {
                    if (sjisBytesLeft > 0) {
                        if (value < 0x40 || value === 0x7F || value > 0xFC) {
                            canBeShiftJIS = false;
                        }
                        else {
                            sjisBytesLeft--;
                        }
                    }
                    else if (value === 0x80 || value === 0xA0 || value > 0xEF) {
                        canBeShiftJIS = false;
                    }
                    else if (value > 0xA0 && value < 0xE0) {
                        sjisKatakanaChars++;
                        sjisCurDoubleBytesWordLength = 0;
                        sjisCurKatakanaWordLength++;
                        if (sjisCurKatakanaWordLength > sjisMaxKatakanaWordLength) {
                            sjisMaxKatakanaWordLength = sjisCurKatakanaWordLength;
                        }
                    }
                    else if (value > 0x7F) {
                        sjisBytesLeft++;
                        // sjisDoubleBytesChars++
                        sjisCurKatakanaWordLength = 0;
                        sjisCurDoubleBytesWordLength++;
                        if (sjisCurDoubleBytesWordLength > sjisMaxDoubleBytesWordLength) {
                            sjisMaxDoubleBytesWordLength = sjisCurDoubleBytesWordLength;
                        }
                    }
                    else {
                        // sjisLowChars++
                        sjisCurKatakanaWordLength = 0;
                        sjisCurDoubleBytesWordLength = 0;
                    }
                }
            }
            if (canBeUTF8 && utf8BytesLeft > 0) {
                canBeUTF8 = false;
            }
            if (canBeShiftJIS && sjisBytesLeft > 0) {
                canBeShiftJIS = false;
            }
            // Easy -- if there is BOM or at least 1 valid not-single byte character (and no evidence it can't be UTF-8), done
            if (canBeUTF8 && (utf8bom || utf2BytesChars + utf3BytesChars + utf4BytesChars > 0)) {
                return StringUtils.UTF8;
            }
            // Easy -- if assuming Shift_JIS or at least 3 valid consecutive not-ascii characters (and no evidence it can't be), done
            if (canBeShiftJIS && (StringUtils.ASSUME_SHIFT_JIS || sjisMaxKatakanaWordLength >= 3 || sjisMaxDoubleBytesWordLength >= 3)) {
                return StringUtils.SHIFT_JIS;
            }
            // Distinguishing Shift_JIS and ISO-8859-1 can be a little tough for short words. The crude heuristic is:
            // - If we saw
            //   - only two consecutive katakana chars in the whole text, or
            //   - at least 10% of bytes that could be "upper" not-alphanumeric Latin1,
            // - then we conclude Shift_JIS, else ISO-8859-1
            if (canBeISO88591 && canBeShiftJIS) {
                return (sjisMaxKatakanaWordLength === 2 && sjisKatakanaChars === 2) || isoHighOther * 10 >= length
                    ? StringUtils.SHIFT_JIS : StringUtils.ISO88591;
            }
            // Otherwise, try in order ISO-8859-1, Shift JIS, UTF-8 and fall back to default platform encoding
            if (canBeISO88591) {
                return StringUtils.ISO88591;
            }
            if (canBeShiftJIS) {
                return StringUtils.SHIFT_JIS;
            }
            if (canBeUTF8) {
                return StringUtils.UTF8;
            }
            // Otherwise, we take a wild guess with platform encoding
            return StringUtils.PLATFORM_DEFAULT_ENCODING;
        }
        /**
         *
         * @see https://stackoverflow.com/a/13439711/4367683
         *
         * @param append The new string to append.
         * @param args Argumets values to be formated.
         */
        static format(append, ...args) {
            let i = -1;
            function callback(exp, p0, p1, p2, p3, p4) {
                if (exp === '%%')
                    return '%';
                if (args[++i] === undefined)
                    return undefined;
                exp = p2 ? parseInt(p2.substr(1)) : undefined;
                let base = p3 ? parseInt(p3.substr(1)) : undefined;
                let val;
                switch (p4) {
                    case 's':
                        val = args[i];
                        break;
                    case 'c':
                        val = args[i][0];
                        break;
                    case 'f':
                        val = parseFloat(args[i]).toFixed(exp);
                        break;
                    case 'p':
                        val = parseFloat(args[i]).toPrecision(exp);
                        break;
                    case 'e':
                        val = parseFloat(args[i]).toExponential(exp);
                        break;
                    case 'x':
                        val = parseInt(args[i]).toString(base ? base : 16);
                        break;
                    case 'd':
                        val = parseFloat(parseInt(args[i], base ? base : 10).toPrecision(exp)).toFixed(0);
                        break;
                }
                val = typeof val === 'object' ? JSON.stringify(val) : (+val).toString(base);
                let size = parseInt(p1); /* padding size */
                let ch = p1 && (p1[0] + '') === '0' ? '0' : ' '; /* isnull? */
                while (val.length < size)
                    val = p0 !== undefined ? val + ch : ch + val; /* isminus? */
                return val;
            }
            let regex = /%(-)?(0?[0-9]+)?([.][0-9]+)?([#][0-9]+)?([scfpexd%])/g;
            return append.replace(regex, callback);
        }
        /**
         *
         */
        static getBytes(str, encoding) {
            return StringEncoding.encode(str, encoding);
        }
        /**
         * Returns the charcode at the specified index or at index zero.
         */
        static getCharCode(str, index = 0) {
            return str.charCodeAt(index);
        }
        /**
         * Returns char for given charcode
         */
        static getCharAt(charCode) {
            return String.fromCharCode(charCode);
        }
    }
    StringUtils.SHIFT_JIS = CharacterSetECI.SJIS.getName(); // "SJIS"
    StringUtils.GB2312 = 'GB2312';
    StringUtils.ISO88591 = CharacterSetECI.ISO8859_1.getName(); // "ISO8859_1"
    StringUtils.EUC_JP = 'EUC_JP';
    StringUtils.UTF8 = CharacterSetECI.UTF8.getName(); // "UTF8"
    StringUtils.PLATFORM_DEFAULT_ENCODING = StringUtils.UTF8; // "UTF8"//Charset.defaultCharset().name()
    StringUtils.ASSUME_SHIFT_JIS = false;
  
    class StringBuilder {
        constructor(value = '') {
            this.value = value;
        }
        enableDecoding(encoding) {
            this.encoding = encoding;
            return this;
        }
        append(s) {
            if (typeof s === 'string') {
                this.value += s.toString();
            }
            else if (this.encoding) {
                // use passed format (fromCharCode will return UTF8 encoding)
                this.value += StringUtils.castAsNonUtf8Char(s, this.encoding);
            }
            else {
                // correctly converts from UTF-8, but not other encodings
                this.value += String.fromCharCode(s);
            }
            return this;
        }
        appendChars(str, offset, len) {
            for (let i = offset; offset < offset + len; i++) {
                this.append(str[i]);
            }
            return this;
        }
        length() {
            return this.value.length;
        }
        charAt(n) {
            return this.value.charAt(n);
        }
        deleteCharAt(n) {
            this.value = this.value.substr(0, n) + this.value.substring(n + 1);
        }
        setCharAt(n, c) {
            this.value = this.value.substr(0, n) + c + this.value.substr(n + 1);
        }
        substring(start, end) {
            return this.value.substring(start, end);
        }
        /**
         * @note helper method for RSS Expanded
         */
        setLengthToZero() {
            this.value = '';
        }
        toString() {
            return this.value;
        }
        insert(n, c) {
            this.value = this.value.substr(0, n) + c + this.value.substr(n + c.length);
        }
    }
  
    /*
     * Copyright 2007 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * <p>Represents a 2D matrix of bits. In function arguments below, and throughout the common
     * module, x is the column position, and y is the row position. The ordering is always x, y.
     * The origin is at the top-left.</p>
     *
     * <p>Internally the bits are represented in a 1-D array of 32-bit ints. However, each row begins
     * with a new int. This is done intentionally so that we can copy out a row into a BitArray very
     * efficiently.</p>
     *
     * <p>The ordering of bits is row-major. Within each int, the least significant bits are used first,
     * meaning they represent lower x values. This is compatible with BitArray's implementation.</p>
     *
     * @author Sean Owen
     * @author dswitkin@google.com (Daniel Switkin)
     */
    class BitMatrix /*implements Cloneable*/ {
        /**
         * Creates an empty square {@link BitMatrix}.
         *
         * @param dimension height and width
         */
        // public constructor(dimension: number /*int*/) {
        //   this(dimension, dimension)
        // }
        /**
         * Creates an empty {@link BitMatrix}.
         *
         * @param width bit matrix width
         * @param height bit matrix height
         */
        // public constructor(width: number /*int*/, height: number /*int*/) {
        //   if (width < 1 || height < 1) {
        //     throw new IllegalArgumentException("Both dimensions must be greater than 0")
        //   }
        //   this.width = width
        //   this.height = height
        //   this.rowSize = (width + 31) / 32
        //   bits = new int[rowSize * height];
        // }
        constructor(width /*int*/, height /*int*/, rowSize /*int*/, bits) {
            this.width = width;
            this.height = height;
            this.rowSize = rowSize;
            this.bits = bits;
            if (undefined === height || null === height) {
                height = width;
            }
            this.height = height;
            if (width < 1 || height < 1) {
                throw new IllegalArgumentException('Both dimensions must be greater than 0');
            }
            if (undefined === rowSize || null === rowSize) {
                rowSize = Math.floor((width + 31) / 32);
            }
            this.rowSize = rowSize;
            if (undefined === bits || null === bits) {
                this.bits = new Int32Array(this.rowSize * this.height);
            }
        }
        /**
         * Interprets a 2D array of booleans as a {@link BitMatrix}, where "true" means an "on" bit.
         *
         * @function parse
         * @param image bits of the image, as a row-major 2D array. Elements are arrays representing rows
         * @return {@link BitMatrix} representation of image
         */
        static parseFromBooleanArray(image) {
            const height = image.length;
            const width = image[0].length;
            const bits = new BitMatrix(width, height);
            for (let i = 0; i < height; i++) {
                const imageI = image[i];
                for (let j = 0; j < width; j++) {
                    if (imageI[j]) {
                        bits.set(j, i);
                    }
                }
            }
            return bits;
        }
        /**
         *
         * @function parse
         * @param stringRepresentation
         * @param setString
         * @param unsetString
         */
        static parseFromString(stringRepresentation, setString, unsetString) {
            if (stringRepresentation === null) {
                throw new IllegalArgumentException('stringRepresentation cannot be null');
            }
            const bits = new Array(stringRepresentation.length);
            let bitsPos = 0;
            let rowStartPos = 0;
            let rowLength = -1;
            let nRows = 0;
            let pos = 0;
            while (pos < stringRepresentation.length) {
                if (stringRepresentation.charAt(pos) === '\n' ||
                    stringRepresentation.charAt(pos) === '\r') {
                    if (bitsPos > rowStartPos) {
                        if (rowLength === -1) {
                            rowLength = bitsPos - rowStartPos;
                        }
                        else if (bitsPos - rowStartPos !== rowLength) {
                            throw new IllegalArgumentException('row lengths do not match');
                        }
                        rowStartPos = bitsPos;
                        nRows++;
                    }
                    pos++;
                }
                else if (stringRepresentation.substring(pos, pos + setString.length) === setString) {
                    pos += setString.length;
                    bits[bitsPos] = true;
                    bitsPos++;
                }
                else if (stringRepresentation.substring(pos, pos + unsetString.length) === unsetString) {
                    pos += unsetString.length;
                    bits[bitsPos] = false;
                    bitsPos++;
                }
                else {
                    throw new IllegalArgumentException('illegal character encountered: ' + stringRepresentation.substring(pos));
                }
            }
            // no EOL at end?
            if (bitsPos > rowStartPos) {
                if (rowLength === -1) {
                    rowLength = bitsPos - rowStartPos;
                }
                else if (bitsPos - rowStartPos !== rowLength) {
                    throw new IllegalArgumentException('row lengths do not match');
                }
                nRows++;
            }
            const matrix = new BitMatrix(rowLength, nRows);
            for (let i = 0; i < bitsPos; i++) {
                if (bits[i]) {
                    matrix.set(Math.floor(i % rowLength), Math.floor(i / rowLength));
                }
            }
            return matrix;
        }
        /**
         * <p>Gets the requested bit, where true means black.</p>
         *
         * @param x The horizontal component (i.e. which column)
         * @param y The vertical component (i.e. which row)
         * @return value of given bit in matrix
         */
        get(x /*int*/, y /*int*/) {
            const offset = y * this.rowSize + Math.floor(x / 32);
            return ((this.bits[offset] >>> (x & 0x1f)) & 1) !== 0;
        }
        /**
         * <p>Sets the given bit to true.</p>
         *
         * @param x The horizontal component (i.e. which column)
         * @param y The vertical component (i.e. which row)
         */
        set(x /*int*/, y /*int*/) {
            const offset = y * this.rowSize + Math.floor(x / 32);
            this.bits[offset] |= (1 << (x & 0x1f)) & 0xFFFFFFFF;
        }
        unset(x /*int*/, y /*int*/) {
            const offset = y * this.rowSize + Math.floor(x / 32);
            this.bits[offset] &= ~((1 << (x & 0x1f)) & 0xFFFFFFFF);
        }
        /**
         * <p>Flips the given bit.</p>
         *
         * @param x The horizontal component (i.e. which column)
         * @param y The vertical component (i.e. which row)
         */
        flip(x /*int*/, y /*int*/) {
            const offset = y * this.rowSize + Math.floor(x / 32);
            this.bits[offset] ^= ((1 << (x & 0x1f)) & 0xFFFFFFFF);
        }
        /**
         * Exclusive-or (XOR): Flip the bit in this {@code BitMatrix} if the corresponding
         * mask bit is set.
         *
         * @param mask XOR mask
         */
        xor(mask) {
            if (this.width !== mask.getWidth() || this.height !== mask.getHeight()
                || this.rowSize !== mask.getRowSize()) {
                throw new IllegalArgumentException('input matrix dimensions do not match');
            }
            const rowArray = new BitArray(Math.floor(this.width / 32) + 1);
            const rowSize = this.rowSize;
            const bits = this.bits;
            for (let y = 0, height = this.height; y < height; y++) {
                const offset = y * rowSize;
                const row = mask.getRow(y, rowArray).getBitArray();
                for (let x = 0; x < rowSize; x++) {
                    bits[offset + x] ^= row[x];
                }
            }
        }
        /**
         * Clears all bits (sets to false).
         */
        clear() {
            const bits = this.bits;
            const max = bits.length;
            for (let i = 0; i < max; i++) {
                bits[i] = 0;
            }
        }
        /**
         * <p>Sets a square region of the bit matrix to true.</p>
         *
         * @param left The horizontal position to begin at (inclusive)
         * @param top The vertical position to begin at (inclusive)
         * @param width The width of the region
         * @param height The height of the region
         */
        setRegion(left /*int*/, top /*int*/, width /*int*/, height /*int*/) {
            if (top < 0 || left < 0) {
                throw new IllegalArgumentException('Left and top must be nonnegative');
            }
            if (height < 1 || width < 1) {
                throw new IllegalArgumentException('Height and width must be at least 1');
            }
            const right = left + width;
            const bottom = top + height;
            if (bottom > this.height || right > this.width) {
                throw new IllegalArgumentException('The region must fit inside the matrix');
            }
            const rowSize = this.rowSize;
            const bits = this.bits;
            for (let y = top; y < bottom; y++) {
                const offset = y * rowSize;
                for (let x = left; x < right; x++) {
                    bits[offset + Math.floor(x / 32)] |= ((1 << (x & 0x1f)) & 0xFFFFFFFF);
                }
            }
        }
        /**
         * A fast method to retrieve one row of data from the matrix as a BitArray.
         *
         * @param y The row to retrieve
         * @param row An optional caller-allocated BitArray, will be allocated if null or too small
         * @return The resulting BitArray - this reference should always be used even when passing
         *         your own row
         */
        getRow(y /*int*/, row) {
            if (row === null || row === undefined || row.getSize() < this.width) {
                row = new BitArray(this.width);
            }
            else {
                row.clear();
            }
            const rowSize = this.rowSize;
            const bits = this.bits;
            const offset = y * rowSize;
            for (let x = 0; x < rowSize; x++) {
                row.setBulk(x * 32, bits[offset + x]);
            }
            return row;
        }
        /**
         * @param y row to set
         * @param row {@link BitArray} to copy from
         */
        setRow(y /*int*/, row) {
            System.arraycopy(row.getBitArray(), 0, this.bits, y * this.rowSize, this.rowSize);
        }
        /**
         * Modifies this {@code BitMatrix} to represent the same but rotated 180 degrees
         */
        rotate180() {
            const width = this.getWidth();
            const height = this.getHeight();
            let topRow = new BitArray(width);
            let bottomRow = new BitArray(width);
            for (let i = 0, length = Math.floor((height + 1) / 2); i < length; i++) {
                topRow = this.getRow(i, topRow);
                bottomRow = this.getRow(height - 1 - i, bottomRow);
                topRow.reverse();
                bottomRow.reverse();
                this.setRow(i, bottomRow);
                this.setRow(height - 1 - i, topRow);
            }
        }
        /**
         * This is useful in detecting the enclosing rectangle of a 'pure' barcode.
         *
         * @return {@code left,top,width,height} enclosing rectangle of all 1 bits, or null if it is all white
         */
        getEnclosingRectangle() {
            const width = this.width;
            const height = this.height;
            const rowSize = this.rowSize;
            const bits = this.bits;
            let left = width;
            let top = height;
            let right = -1;
            let bottom = -1;
            for (let y = 0; y < height; y++) {
                for (let x32 = 0; x32 < rowSize; x32++) {
                    const theBits = bits[y * rowSize + x32];
                    if (theBits !== 0) {
                        if (y < top) {
                            top = y;
                        }
                        if (y > bottom) {
                            bottom = y;
                        }
                        if (x32 * 32 < left) {
                            let bit = 0;
                            while (((theBits << (31 - bit)) & 0xFFFFFFFF) === 0) {
                                bit++;
                            }
                            if ((x32 * 32 + bit) < left) {
                                left = x32 * 32 + bit;
                            }
                        }
                        if (x32 * 32 + 31 > right) {
                            let bit = 31;
                            while ((theBits >>> bit) === 0) {
                                bit--;
                            }
                            if ((x32 * 32 + bit) > right) {
                                right = x32 * 32 + bit;
                            }
                        }
                    }
                }
            }
            if (right < left || bottom < top) {
                return null;
            }
            return Int32Array.from([left, top, right - left + 1, bottom - top + 1]);
        }
        /**
         * This is useful in detecting a corner of a 'pure' barcode.
         *
         * @return {@code x,y} coordinate of top-left-most 1 bit, or null if it is all white
         */
        getTopLeftOnBit() {
            const rowSize = this.rowSize;
            const bits = this.bits;
            let bitsOffset = 0;
            while (bitsOffset < bits.length && bits[bitsOffset] === 0) {
                bitsOffset++;
            }
            if (bitsOffset === bits.length) {
                return null;
            }
            const y = bitsOffset / rowSize;
            let x = (bitsOffset % rowSize) * 32;
            const theBits = bits[bitsOffset];
            let bit = 0;
            while (((theBits << (31 - bit)) & 0xFFFFFFFF) === 0) {
                bit++;
            }
            x += bit;
            return Int32Array.from([x, y]);
        }
        getBottomRightOnBit() {
            const rowSize = this.rowSize;
            const bits = this.bits;
            let bitsOffset = bits.length - 1;
            while (bitsOffset >= 0 && bits[bitsOffset] === 0) {
                bitsOffset--;
            }
            if (bitsOffset < 0) {
                return null;
            }
            const y = Math.floor(bitsOffset / rowSize);
            let x = Math.floor(bitsOffset % rowSize) * 32;
            const theBits = bits[bitsOffset];
            let bit = 31;
            while ((theBits >>> bit) === 0) {
                bit--;
            }
            x += bit;
            return Int32Array.from([x, y]);
        }
        /**
         * @return The width of the matrix
         */
        getWidth() {
            return this.width;
        }
        /**
         * @return The height of the matrix
         */
        getHeight() {
            return this.height;
        }
        /**
         * @return The row size of the matrix
         */
        getRowSize() {
            return this.rowSize;
        }
        /*@Override*/
        equals(o) {
            if (!(o instanceof BitMatrix)) {
                return false;
            }
            const other = o;
            return this.width === other.width && this.height === other.height && this.rowSize === other.rowSize &&
                Arrays.equals(this.bits, other.bits);
        }
        /*@Override*/
        hashCode() {
            let hash = this.width;
            hash = 31 * hash + this.width;
            hash = 31 * hash + this.height;
            hash = 31 * hash + this.rowSize;
            hash = 31 * hash + Arrays.hashCode(this.bits);
            return hash;
        }
        /**
         * @return string representation using "X" for set and " " for unset bits
         */
        /*@Override*/
        // public toString(): string {
        //   return toString(": "X, "  ")
        // }
        /**
         * @param setString representation of a set bit
         * @param unsetString representation of an unset bit
         * @return string representation of entire matrix utilizing given strings
         */
        // public toString(setString: string = "X ", unsetString: string = "  "): string {
        //   return this.buildToString(setString, unsetString, "\n")
        // }
        /**
         * @param setString representation of a set bit
         * @param unsetString representation of an unset bit
         * @param lineSeparator newline character in string representation
         * @return string representation of entire matrix utilizing given strings and line separator
         * @deprecated call {@link #toString(String,String)} only, which uses \n line separator always
         */
        // @Deprecated
        toString(setString = 'X ', unsetString = '  ', lineSeparator = '\n') {
            return this.buildToString(setString, unsetString, lineSeparator);
        }
        buildToString(setString, unsetString, lineSeparator) {
            let result = new StringBuilder();
            // result.append(lineSeparator);
            for (let y = 0, height = this.height; y < height; y++) {
                for (let x = 0, width = this.width; x < width; x++) {
                    result.append(this.get(x, y) ? setString : unsetString);
                }
                result.append(lineSeparator);
            }
            return result.toString();
        }
        /*@Override*/
        clone() {
            return new BitMatrix(this.width, this.height, this.rowSize, this.bits.slice());
        }
    }
  
    /**
     * Custom Error class of type Exception.
     */
    class NotFoundException extends Exception {
        static getNotFoundInstance() {
            return new NotFoundException();
        }
    }
    NotFoundException.kind = 'NotFoundException';
  
    /*
     * Copyright 2009 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * This Binarizer implementation uses the old ZXing global histogram approach. It is suitable
     * for low-end mobile devices which don't have enough CPU or memory to use a local thresholding
     * algorithm. However, because it picks a global black point, it cannot handle difficult shadows
     * and gradients.
     *
     * Faster mobile devices and all desktop applications should probably use HybridBinarizer instead.
     *
     * @author dswitkin@google.com (Daniel Switkin)
     * @author Sean Owen
     */
    class GlobalHistogramBinarizer extends Binarizer {
        constructor(source) {
            super(source);
            this.luminances = GlobalHistogramBinarizer.EMPTY;
            this.buckets = new Int32Array(GlobalHistogramBinarizer.LUMINANCE_BUCKETS);
        }
        // Applies simple sharpening to the row data to improve performance of the 1D Readers.
        /*@Override*/
        getBlackRow(y /*int*/, row) {
            const source = this.getLuminanceSource();
            const width = source.getWidth();
            if (row === undefined || row === null || row.getSize() < width) {
                row = new BitArray(width);
            }
            else {
                row.clear();
            }
            this.initArrays(width);
            const localLuminances = source.getRow(y, this.luminances);
            const localBuckets = this.buckets;
            for (let x = 0; x < width; x++) {
                localBuckets[(localLuminances[x] & 0xff) >> GlobalHistogramBinarizer.LUMINANCE_SHIFT]++;
            }
            const blackPoint = GlobalHistogramBinarizer.estimateBlackPoint(localBuckets);
            if (width < 3) {
                // Special case for very small images
                for (let x = 0; x < width; x++) {
                    if ((localLuminances[x] & 0xff) < blackPoint) {
                        row.set(x);
                    }
                }
            }
            else {
                let left = localLuminances[0] & 0xff;
                let center = localLuminances[1] & 0xff;
                for (let x = 1; x < width - 1; x++) {
                    const right = localLuminances[x + 1] & 0xff;
                    // A simple -1 4 -1 box filter with a weight of 2.
                    if (((center * 4) - left - right) / 2 < blackPoint) {
                        row.set(x);
                    }
                    left = center;
                    center = right;
                }
            }
            return row;
        }
        // Does not sharpen the data, as this call is intended to only be used by 2D Readers.
        /*@Override*/
        getBlackMatrix() {
            const source = this.getLuminanceSource();
            const width = source.getWidth();
            const height = source.getHeight();
            const matrix = new BitMatrix(width, height);
            // Quickly calculates the histogram by sampling four rows from the image. This proved to be
            // more robust on the blackbox tests than sampling a diagonal as we used to do.
            this.initArrays(width);
            const localBuckets = this.buckets;
            for (let y = 1; y < 5; y++) {
                const row = Math.floor((height * y) / 5);
                const localLuminances = source.getRow(row, this.luminances);
                const right = Math.floor((width * 4) / 5);
                for (let x = Math.floor(width / 5); x < right; x++) {
                    const pixel = localLuminances[x] & 0xff;
                    localBuckets[pixel >> GlobalHistogramBinarizer.LUMINANCE_SHIFT]++;
                }
            }
            const blackPoint = GlobalHistogramBinarizer.estimateBlackPoint(localBuckets);
            // We delay reading the entire image luminance until the black point estimation succeeds.
            // Although we end up reading four rows twice, it is consistent with our motto of
            // "fail quickly" which is necessary for continuous scanning.
            const localLuminances = source.getMatrix();
            for (let y = 0; y < height; y++) {
                const offset = y * width;
                for (let x = 0; x < width; x++) {
                    const pixel = localLuminances[offset + x] & 0xff;
                    if (pixel < blackPoint) {
                        matrix.set(x, y);
                    }
                }
            }
            return matrix;
        }
        /*@Override*/
        createBinarizer(source) {
            return new GlobalHistogramBinarizer(source);
        }
        initArrays(luminanceSize /*int*/) {
            if (this.luminances.length < luminanceSize) {
                this.luminances = new Uint8ClampedArray(luminanceSize);
            }
            const buckets = this.buckets;
            for (let x = 0; x < GlobalHistogramBinarizer.LUMINANCE_BUCKETS; x++) {
                buckets[x] = 0;
            }
        }
        static estimateBlackPoint(buckets) {
            // Find the tallest peak in the histogram.
            const numBuckets = buckets.length;
            let maxBucketCount = 0;
            let firstPeak = 0;
            let firstPeakSize = 0;
            for (let x = 0; x < numBuckets; x++) {
                if (buckets[x] > firstPeakSize) {
                    firstPeak = x;
                    firstPeakSize = buckets[x];
                }
                if (buckets[x] > maxBucketCount) {
                    maxBucketCount = buckets[x];
                }
            }
            // Find the second-tallest peak which is somewhat far from the tallest peak.
            let secondPeak = 0;
            let secondPeakScore = 0;
            for (let x = 0; x < numBuckets; x++) {
                const distanceToBiggest = x - firstPeak;
                // Encourage more distant second peaks by multiplying by square of distance.
                const score = buckets[x] * distanceToBiggest * distanceToBiggest;
                if (score > secondPeakScore) {
                    secondPeak = x;
                    secondPeakScore = score;
                }
            }
            // Make sure firstPeak corresponds to the black peak.
            if (firstPeak > secondPeak) {
                const temp = firstPeak;
                firstPeak = secondPeak;
                secondPeak = temp;
            }
            // If there is too little contrast in the image to pick a meaningful black point, throw rather
            // than waste time trying to decode the image, and risk false positives.
            if (secondPeak - firstPeak <= numBuckets / 16) {
                throw new NotFoundException();
            }
            // Find a valley between them that is low and closer to the white peak.
            let bestValley = secondPeak - 1;
            let bestValleyScore = -1;
            for (let x = secondPeak - 1; x > firstPeak; x--) {
                const fromFirst = x - firstPeak;
                const score = fromFirst * fromFirst * (secondPeak - x) * (maxBucketCount - buckets[x]);
                if (score > bestValleyScore) {
                    bestValley = x;
                    bestValleyScore = score;
                }
            }
            return bestValley << GlobalHistogramBinarizer.LUMINANCE_SHIFT;
        }
    }
    GlobalHistogramBinarizer.LUMINANCE_BITS = 5;
    GlobalHistogramBinarizer.LUMINANCE_SHIFT = 8 - GlobalHistogramBinarizer.LUMINANCE_BITS;
    GlobalHistogramBinarizer.LUMINANCE_BUCKETS = 1 << GlobalHistogramBinarizer.LUMINANCE_BITS;
    GlobalHistogramBinarizer.EMPTY = Uint8ClampedArray.from([0]);
  
    /*
     * Copyright 2009 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * This class implements a local thresholding algorithm, which while slower than the
     * GlobalHistogramBinarizer, is fairly efficient for what it does. It is designed for
     * high frequency images of barcodes with black data on white backgrounds. For this application,
     * it does a much better job than a global blackpoint with severe shadows and gradients.
     * However it tends to produce artifacts on lower frequency images and is therefore not
     * a good general purpose binarizer for uses outside ZXing.
     *
     * This class extends GlobalHistogramBinarizer, using the older histogram approach for 1D readers,
     * and the newer local approach for 2D readers. 1D decoding using a per-row histogram is already
     * inherently local, and only fails for horizontal gradients. We can revisit that problem later,
     * but for now it was not a win to use local blocks for 1D.
     *
     * This Binarizer is the default for the unit tests and the recommended class for library users.
     *
     * @author dswitkin@google.com (Daniel Switkin)
     */
    class HybridBinarizer extends GlobalHistogramBinarizer {
        constructor(source) {
            super(source);
            this.matrix = null;
        }
        /**
         * Calculates the final BitMatrix once for all requests. This could be called once from the
         * constructor instead, but there are some advantages to doing it lazily, such as making
         * profiling easier, and not doing heavy lifting when callers don't expect it.
         */
        /*@Override*/
        getBlackMatrix() {
            if (this.matrix !== null) {
                return this.matrix;
            }
            const source = this.getLuminanceSource();
            const width = source.getWidth();
            const height = source.getHeight();
            if (width >= HybridBinarizer.MINIMUM_DIMENSION && height >= HybridBinarizer.MINIMUM_DIMENSION) {
                const luminances = source.getMatrix();
                let subWidth = width >> HybridBinarizer.BLOCK_SIZE_POWER;
                if ((width & HybridBinarizer.BLOCK_SIZE_MASK) !== 0) {
                    subWidth++;
                }
                let subHeight = height >> HybridBinarizer.BLOCK_SIZE_POWER;
                if ((height & HybridBinarizer.BLOCK_SIZE_MASK) !== 0) {
                    subHeight++;
                }
                const blackPoints = HybridBinarizer.calculateBlackPoints(luminances, subWidth, subHeight, width, height);
                const newMatrix = new BitMatrix(width, height);
                HybridBinarizer.calculateThresholdForBlock(luminances, subWidth, subHeight, width, height, blackPoints, newMatrix);
                this.matrix = newMatrix;
            }
            else {
                // If the image is too small, fall back to the global histogram approach.
                this.matrix = super.getBlackMatrix();
            }
            return this.matrix;
        }
        /*@Override*/
        createBinarizer(source) {
            return new HybridBinarizer(source);
        }
        /**
         * For each block in the image, calculate the average black point using a 5x5 grid
         * of the blocks around it. Also handles the corner cases (fractional blocks are computed based
         * on the last pixels in the row/column which are also used in the previous block).
         */
        static calculateThresholdForBlock(luminances, subWidth /*int*/, subHeight /*int*/, width /*int*/, height /*int*/, blackPoints, matrix) {
            const maxYOffset = height - HybridBinarizer.BLOCK_SIZE;
            const maxXOffset = width - HybridBinarizer.BLOCK_SIZE;
            for (let y = 0; y < subHeight; y++) {
                let yoffset = y << HybridBinarizer.BLOCK_SIZE_POWER;
                if (yoffset > maxYOffset) {
                    yoffset = maxYOffset;
                }
                const top = HybridBinarizer.cap(y, 2, subHeight - 3);
                for (let x = 0; x < subWidth; x++) {
                    let xoffset = x << HybridBinarizer.BLOCK_SIZE_POWER;
                    if (xoffset > maxXOffset) {
                        xoffset = maxXOffset;
                    }
                    const left = HybridBinarizer.cap(x, 2, subWidth - 3);
                    let sum = 0;
                    for (let z = -2; z <= 2; z++) {
                        const blackRow = blackPoints[top + z];
                        sum += blackRow[left - 2] + blackRow[left - 1] + blackRow[left] + blackRow[left + 1] + blackRow[left + 2];
                    }
                    const average = sum / 25;
                    HybridBinarizer.thresholdBlock(luminances, xoffset, yoffset, average, width, matrix);
                }
            }
        }
        static cap(value /*int*/, min /*int*/, max /*int*/) {
            return value < min ? min : value > max ? max : value;
        }
        /**
         * Applies a single threshold to a block of pixels.
         */
        static thresholdBlock(luminances, xoffset /*int*/, yoffset /*int*/, threshold /*int*/, stride /*int*/, matrix) {
            for (let y = 0, offset = yoffset * stride + xoffset; y < HybridBinarizer.BLOCK_SIZE; y++, offset += stride) {
                for (let x = 0; x < HybridBinarizer.BLOCK_SIZE; x++) {
                    // Comparison needs to be <= so that black == 0 pixels are black even if the threshold is 0.
                    if ((luminances[offset + x] & 0xFF) <= threshold) {
                        matrix.set(xoffset + x, yoffset + y);
                    }
                }
            }
        }
        /**
         * Calculates a single black point for each block of pixels and saves it away.
         * See the following thread for a discussion of this algorithm:
         *  http://groups.google.com/group/zxing/browse_thread/thread/d06efa2c35a7ddc0
         */
        static calculateBlackPoints(luminances, subWidth /*int*/, subHeight /*int*/, width /*int*/, height /*int*/) {
            const maxYOffset = height - HybridBinarizer.BLOCK_SIZE;
            const maxXOffset = width - HybridBinarizer.BLOCK_SIZE;
            // tslint:disable-next-line:whitespace
            const blackPoints = new Array(subHeight); // subWidth
            for (let y = 0; y < subHeight; y++) {
                blackPoints[y] = new Int32Array(subWidth);
                let yoffset = y << HybridBinarizer.BLOCK_SIZE_POWER;
                if (yoffset > maxYOffset) {
                    yoffset = maxYOffset;
                }
                for (let x = 0; x < subWidth; x++) {
                    let xoffset = x << HybridBinarizer.BLOCK_SIZE_POWER;
                    if (xoffset > maxXOffset) {
                        xoffset = maxXOffset;
                    }
                    let sum = 0;
                    let min = 0xFF;
                    let max = 0;
                    for (let yy = 0, offset = yoffset * width + xoffset; yy < HybridBinarizer.BLOCK_SIZE; yy++, offset += width) {
                        for (let xx = 0; xx < HybridBinarizer.BLOCK_SIZE; xx++) {
                            const pixel = luminances[offset + xx] & 0xFF;
                            sum += pixel;
                            // still looking for good contrast
                            if (pixel < min) {
                                min = pixel;
                            }
                            if (pixel > max) {
                                max = pixel;
                            }
                        }
                        // short-circuit min/max tests once dynamic range is met
                        if (max - min > HybridBinarizer.MIN_DYNAMIC_RANGE) {
                            // finish the rest of the rows quickly
                            for (yy++, offset += width; yy < HybridBinarizer.BLOCK_SIZE; yy++, offset += width) {
                                for (let xx = 0; xx < HybridBinarizer.BLOCK_SIZE; xx++) {
                                    sum += luminances[offset + xx] & 0xFF;
                                }
                            }
                        }
                    }
                    // The default estimate is the average of the values in the block.
                    let average = sum >> (HybridBinarizer.BLOCK_SIZE_POWER * 2);
                    if (max - min <= HybridBinarizer.MIN_DYNAMIC_RANGE) {
                        // If variation within the block is low, assume this is a block with only light or only
                        // dark pixels. In that case we do not want to use the average, as it would divide this
                        // low contrast area into black and white pixels, essentially creating data out of noise.
                        //
                        // The default assumption is that the block is light/background. Since no estimate for
                        // the level of dark pixels exists locally, use half the min for the block.
                        average = min / 2;
                        if (y > 0 && x > 0) {
                            // Correct the "white background" assumption for blocks that have neighbors by comparing
                            // the pixels in this block to the previously calculated black points. This is based on
                            // the fact that dark barcode symbology is always surrounded by some amount of light
                            // background for which reasonable black point estimates were made. The bp estimated at
                            // the boundaries is used for the interior.
                            // The (min < bp) is arbitrary but works better than other heuristics that were tried.
                            const averageNeighborBlackPoint = (blackPoints[y - 1][x] + (2 * blackPoints[y][x - 1]) + blackPoints[y - 1][x - 1]) / 4;
                            if (min < averageNeighborBlackPoint) {
                                average = averageNeighborBlackPoint;
                            }
                        }
                    }
                    blackPoints[y][x] = average;
                }
            }
            return blackPoints;
        }
    }
    // This class uses 5x5 blocks to compute local luminance, where each block is 8x8 pixels.
    // So this is the smallest dimension in each axis we can accept.
    HybridBinarizer.BLOCK_SIZE_POWER = 3;
    HybridBinarizer.BLOCK_SIZE = 1 << HybridBinarizer.BLOCK_SIZE_POWER; // ...0100...00
    HybridBinarizer.BLOCK_SIZE_MASK = HybridBinarizer.BLOCK_SIZE - 1; // ...0011...11
    HybridBinarizer.MINIMUM_DIMENSION = HybridBinarizer.BLOCK_SIZE * 5;
    HybridBinarizer.MIN_DYNAMIC_RANGE = 24;
  
    /*
     * Copyright 2009 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /*namespace com.google.zxing {*/
    /**
     * The purpose of this class hierarchy is to abstract different bitmap implementations across
     * platforms into a standard interface for requesting greyscale luminance values. The interface
     * only provides immutable methods; therefore crop and rotation create copies. This is to ensure
     * that one Reader does not modify the original luminance source and leave it in an unknown state
     * for other Readers in the chain.
     *
     * @author dswitkin@google.com (Daniel Switkin)
     */
    class LuminanceSource {
        constructor(width /*int*/, height /*int*/) {
            this.width = width;
            this.height = height;
        }
        /**
         * @return The width of the bitmap.
         */
        getWidth() {
            return this.width;
        }
        /**
         * @return The height of the bitmap.
         */
        getHeight() {
            return this.height;
        }
        /**
         * @return Whether this subclass supports cropping.
         */
        isCropSupported() {
            return false;
        }
        /**
         * Returns a new object with cropped image data. Implementations may keep a reference to the
         * original data rather than a copy. Only callable if isCropSupported() is true.
         *
         * @param left The left coordinate, which must be in [0,getWidth())
         * @param top The top coordinate, which must be in [0,getHeight())
         * @param width The width of the rectangle to crop.
         * @param height The height of the rectangle to crop.
         * @return A cropped version of this object.
         */
        crop(left /*int*/, top /*int*/, width /*int*/, height /*int*/) {
            throw new UnsupportedOperationException('This luminance source does not support cropping.');
        }
        /**
         * @return Whether this subclass supports counter-clockwise rotation.
         */
        isRotateSupported() {
            return false;
        }
        /**
         * Returns a new object with rotated image data by 90 degrees counterclockwise.
         * Only callable if {@link #isRotateSupported()} is true.
         *
         * @return A rotated version of this object.
         */
        rotateCounterClockwise() {
            throw new UnsupportedOperationException('This luminance source does not support rotation by 90 degrees.');
        }
        /**
         * Returns a new object with rotated image data by 45 degrees counterclockwise.
         * Only callable if {@link #isRotateSupported()} is true.
         *
         * @return A rotated version of this object.
         */
        rotateCounterClockwise45() {
            throw new UnsupportedOperationException('This luminance source does not support rotation by 45 degrees.');
        }
        /*@Override*/
        toString() {
            const row = new Uint8ClampedArray(this.width);
            let result = new StringBuilder();
            for (let y = 0; y < this.height; y++) {
                const sourceRow = this.getRow(y, row);
                for (let x = 0; x < this.width; x++) {
                    const luminance = sourceRow[x] & 0xFF;
                    let c;
                    if (luminance < 0x40) {
                        c = '#';
                    }
                    else if (luminance < 0x80) {
                        c = '+';
                    }
                    else if (luminance < 0xC0) {
                        c = '.';
                    }
                    else {
                        c = ' ';
                    }
                    result.append(c);
                }
                result.append('\n');
            }
            return result.toString();
        }
    }
  
    /*
     * Copyright 2009 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /*namespace com.google.zxing {*/
    /**
     * A wrapper implementation of {@link LuminanceSource} which inverts the luminances it returns -- black becomes
     * white and vice versa, and each value becomes (255-value).
     *
     * @author Sean Owen
     */
    class InvertedLuminanceSource extends LuminanceSource {
        constructor(delegate) {
            super(delegate.getWidth(), delegate.getHeight());
            this.delegate = delegate;
        }
        /*@Override*/
        getRow(y /*int*/, row) {
            const sourceRow = this.delegate.getRow(y, row);
            const width = this.getWidth();
            for (let i = 0; i < width; i++) {
                sourceRow[i] = /*(byte)*/ (255 - (sourceRow[i] & 0xFF));
            }
            return sourceRow;
        }
        /*@Override*/
        getMatrix() {
            const matrix = this.delegate.getMatrix();
            const length = this.getWidth() * this.getHeight();
            const invertedMatrix = new Uint8ClampedArray(length);
            for (let i = 0; i < length; i++) {
                invertedMatrix[i] = /*(byte)*/ (255 - (matrix[i] & 0xFF));
            }
            return invertedMatrix;
        }
        /*@Override*/
        isCropSupported() {
            return this.delegate.isCropSupported();
        }
        /*@Override*/
        crop(left /*int*/, top /*int*/, width /*int*/, height /*int*/) {
            return new InvertedLuminanceSource(this.delegate.crop(left, top, width, height));
        }
        /*@Override*/
        isRotateSupported() {
            return this.delegate.isRotateSupported();
        }
        /**
         * @return original delegate {@link LuminanceSource} since invert undoes itself
         */
        /*@Override*/
        invert() {
            return this.delegate;
        }
        /*@Override*/
        rotateCounterClockwise() {
            return new InvertedLuminanceSource(this.delegate.rotateCounterClockwise());
        }
        /*@Override*/
        rotateCounterClockwise45() {
            return new InvertedLuminanceSource(this.delegate.rotateCounterClockwise45());
        }
    }
  
    /**
     * @deprecated Moving to @zxing/browser
     */
    class HTMLCanvasElementLuminanceSource extends LuminanceSource {
        constructor(canvas) {
            super(canvas.width, canvas.height);
            this.canvas = canvas;
            this.tempCanvasElement = null;
            this.buffer = HTMLCanvasElementLuminanceSource.makeBufferFromCanvasImageData(canvas);
        }
        static makeBufferFromCanvasImageData(canvas) {
            const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
            return HTMLCanvasElementLuminanceSource.toGrayscaleBuffer(imageData.data, canvas.width, canvas.height);
        }
        static toGrayscaleBuffer(imageBuffer, width, height) {
            const grayscaleBuffer = new Uint8ClampedArray(width * height);
            for (let i = 0, j = 0, length = imageBuffer.length; i < length; i += 4, j++) {
                let gray;
                const alpha = imageBuffer[i + 3];
                // The color of fully-transparent pixels is irrelevant. They are often, technically, fully-transparent
                // black (0 alpha, and then 0 RGB). They are often used, of course as the "white" area in a
                // barcode image. Force any such pixel to be white:
                if (alpha === 0) {
                    gray = 0xFF;
                }
                else {
                    const pixelR = imageBuffer[i];
                    const pixelG = imageBuffer[i + 1];
                    const pixelB = imageBuffer[i + 2];
                    // .299R + 0.587G + 0.114B (YUV/YIQ for PAL and NTSC),
                    // (306*R) >> 10 is approximately equal to R*0.299, and so on.
                    // 0x200 >> 10 is 0.5, it implements rounding.
                    gray = (306 * pixelR +
                        601 * pixelG +
                        117 * pixelB +
                        0x200) >> 10;
                }
                grayscaleBuffer[j] = gray;
            }
            return grayscaleBuffer;
        }
        getRow(y /*int*/, row) {
            if (y < 0 || y >= this.getHeight()) {
                throw new IllegalArgumentException('Requested row is outside the image: ' + y);
            }
            const width = this.getWidth();
            const start = y * width;
            if (row === null) {
                row = this.buffer.slice(start, start + width);
            }
            else {
                if (row.length < width) {
                    row = new Uint8ClampedArray(width);
                }
                // The underlying raster of image consists of bytes with the luminance values
                // TODO: can avoid set/slice?
                row.set(this.buffer.slice(start, start + width));
            }
            return row;
        }
        getMatrix() {
            return this.buffer;
        }
        isCropSupported() {
            return true;
        }
        crop(left /*int*/, top /*int*/, width /*int*/, height /*int*/) {
            super.crop(left, top, width, height);
            return this;
        }
        /**
         * This is always true, since the image is a gray-scale image.
         *
         * @return true
         */
        isRotateSupported() {
            return true;
        }
        rotateCounterClockwise() {
            this.rotate(-90);
            return this;
        }
        rotateCounterClockwise45() {
            this.rotate(-45);
            return this;
        }
        getTempCanvasElement() {
            if (null === this.tempCanvasElement) {
                const tempCanvasElement = this.canvas.ownerDocument.createElement('canvas');
                tempCanvasElement.width = this.canvas.width;
                tempCanvasElement.height = this.canvas.height;
                this.tempCanvasElement = tempCanvasElement;
            }
            return this.tempCanvasElement;
        }
        rotate(angle) {
            const tempCanvasElement = this.getTempCanvasElement();
            const tempContext = tempCanvasElement.getContext('2d');
            const angleRadians = angle * HTMLCanvasElementLuminanceSource.DEGREE_TO_RADIANS;
            // Calculate and set new dimensions for temp canvas
            const width = this.canvas.width;
            const height = this.canvas.height;
            const newWidth = Math.ceil(Math.abs(Math.cos(angleRadians)) * width + Math.abs(Math.sin(angleRadians)) * height);
            const newHeight = Math.ceil(Math.abs(Math.sin(angleRadians)) * width + Math.abs(Math.cos(angleRadians)) * height);
            tempCanvasElement.width = newWidth;
            tempCanvasElement.height = newHeight;
            // Draw at center of temp canvas to prevent clipping of image data
            tempContext.translate(newWidth / 2, newHeight / 2);
            tempContext.rotate(angleRadians);
            tempContext.drawImage(this.canvas, width / -2, height / -2);
            this.buffer = HTMLCanvasElementLuminanceSource.makeBufferFromCanvasImageData(tempCanvasElement);
            return this;
        }
        invert() {
            return new InvertedLuminanceSource(this);
        }
    }
    HTMLCanvasElementLuminanceSource.DEGREE_TO_RADIANS = Math.PI / 180;
  
    /**
     * @deprecated Moving to @zxing/browser
     *
     * Video input device metadata containing the id and label of the device if available.
     */
    class VideoInputDevice {
        /**
         * Creates an instance of VideoInputDevice.
         *
         * @param {string} deviceId the video input device id
         * @param {string} label the label of the device if available
         */
        constructor(deviceId, label, groupId) {
            this.deviceId = deviceId;
            this.label = label;
            /** @inheritdoc */
            this.kind = 'videoinput';
            this.groupId = groupId || undefined;
        }
        /** @inheritdoc */
        toJSON() {
            return {
                kind: this.kind,
                groupId: this.groupId,
                deviceId: this.deviceId,
                label: this.label,
            };
        }
    }
  
    var __awaiter = ((globalThis || global || self || window || undefined) && (globalThis || global || self || window || undefined).__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    /**
     * @deprecated Moving to @zxing/browser
     *
     * Base class for browser code reader.
     */
    class BrowserCodeReader {
        /**
         * Creates an instance of BrowserCodeReader.
         * @param {Reader} reader The reader instance to decode the barcode
         * @param {number} [timeBetweenScansMillis=500] the time delay between subsequent successful decode tries
         *
         * @memberOf BrowserCodeReader
         */
        constructor(reader, timeBetweenScansMillis = 500, _hints) {
            this.reader = reader;
            this.timeBetweenScansMillis = timeBetweenScansMillis;
            this._hints = _hints;
            /**
             * This will break the loop.
             */
            this._stopContinuousDecode = false;
            /**
             * This will break the loop.
             */
            this._stopAsyncDecode = false;
            /**
             * Delay time between decode attempts made by the scanner.
             */
            this._timeBetweenDecodingAttempts = 0;
        }
        /**
         * If navigator is present.
         */
        get hasNavigator() {
            return typeof navigator !== 'undefined';
        }
        /**
         * If mediaDevices under navigator is supported.
         */
        get isMediaDevicesSuported() {
            return this.hasNavigator && !!navigator.mediaDevices;
        }
        /**
         * If enumerateDevices under navigator is supported.
         */
        get canEnumerateDevices() {
            return !!(this.isMediaDevicesSuported && navigator.mediaDevices.enumerateDevices);
        }
        /** Time between two decoding tries in milli seconds. */
        get timeBetweenDecodingAttempts() {
            return this._timeBetweenDecodingAttempts;
        }
        /**
         * Change the time span the decoder waits between two decoding tries.
         *
         * @param {number} millis Time between two decoding tries in milli seconds.
         */
        set timeBetweenDecodingAttempts(millis) {
            this._timeBetweenDecodingAttempts = millis < 0 ? 0 : millis;
        }
        /**
         * Sets the hints.
         */
        set hints(hints) {
            this._hints = hints || null;
        }
        /**
         * Sets the hints.
         */
        get hints() {
            return this._hints;
        }
        /**
         * Lists all the available video input devices.
         */
        listVideoInputDevices() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.hasNavigator) {
                    throw new Error('Can\'t enumerate devices, navigator is not present.');
                }
                if (!this.canEnumerateDevices) {
                    throw new Error('Can\'t enumerate devices, method not supported.');
                }
                const devices = yield navigator.mediaDevices.enumerateDevices();
                const videoDevices = [];
                for (const device of devices) {
                    const kind = device.kind === 'video' ? 'videoinput' : device.kind;
                    if (kind !== 'videoinput') {
                        continue;
                    }
                    const deviceId = device.deviceId || device.id;
                    const label = device.label || `Video device ${videoDevices.length + 1}`;
                    const groupId = device.groupId;
                    const videoDevice = { deviceId, label, kind, groupId };
                    videoDevices.push(videoDevice);
                }
                return videoDevices;
            });
        }
        /**
         * Obtain the list of available devices with type 'videoinput'.
         *
         * @returns {Promise<VideoInputDevice[]>} an array of available video input devices
         *
         * @memberOf BrowserCodeReader
         *
         * @deprecated Use `listVideoInputDevices` instead.
         */
        getVideoInputDevices() {
            return __awaiter(this, void 0, void 0, function* () {
                const devices = yield this.listVideoInputDevices();
                return devices.map(d => new VideoInputDevice(d.deviceId, d.label));
            });
        }
        /**
         * Let's you find a device using it's Id.
         */
        findDeviceById(deviceId) {
            return __awaiter(this, void 0, void 0, function* () {
                const devices = yield this.listVideoInputDevices();
                if (!devices) {
                    return null;
                }
                return devices.find(x => x.deviceId === deviceId);
            });
        }
        /**
         * Decodes the barcode from the device specified by deviceId while showing the video in the specified video element.
         *
         * @param deviceId the id of one of the devices obtained after calling getVideoInputDevices. Can be undefined, in this case it will decode from one of the available devices, preffering the main camera (environment facing) if available.
         * @param video the video element in page where to show the video while decoding. Can be either an element id or directly an HTMLVideoElement. Can be undefined, in which case no video will be shown.
         * @returns The decoding result.
         *
         * @memberOf BrowserCodeReader
         *
         * @deprecated Use `decodeOnceFromVideoDevice` instead.
         */
        decodeFromInputVideoDevice(deviceId, videoSource) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.decodeOnceFromVideoDevice(deviceId, videoSource);
            });
        }
        /**
         * In one attempt, tries to decode the barcode from the device specified by deviceId while showing the video in the specified video element.
         *
         * @param deviceId the id of one of the devices obtained after calling getVideoInputDevices. Can be undefined, in this case it will decode from one of the available devices, preffering the main camera (environment facing) if available.
         * @param video the video element in page where to show the video while decoding. Can be either an element id or directly an HTMLVideoElement. Can be undefined, in which case no video will be shown.
         * @returns The decoding result.
         *
         * @memberOf BrowserCodeReader
         */
        decodeOnceFromVideoDevice(deviceId, videoSource) {
            return __awaiter(this, void 0, void 0, function* () {
                this.reset();
                let videoConstraints;
                if (!deviceId) {
                    videoConstraints = { facingMode: 'environment' };
                }
                else {
                    videoConstraints = { deviceId: { exact: deviceId } };
                }
                const constraints = { video: videoConstraints };
                return yield this.decodeOnceFromConstraints(constraints, videoSource);
            });
        }
        /**
         * In one attempt, tries to decode the barcode from a stream obtained from the given constraints while showing the video in the specified video element.
         *
         * @param constraints the media stream constraints to get s valid media stream to decode from
         * @param video the video element in page where to show the video while decoding. Can be either an element id or directly an HTMLVideoElement. Can be undefined, in which case no video will be shown.
         * @returns The decoding result.
         *
         * @memberOf BrowserCodeReader
         */
        decodeOnceFromConstraints(constraints, videoSource) {
            return __awaiter(this, void 0, void 0, function* () {
                const stream = yield navigator.mediaDevices.getUserMedia(constraints);
                return yield this.decodeOnceFromStream(stream, videoSource);
            });
        }
        /**
         * In one attempt, tries to decode the barcode from a stream obtained from the given constraints while showing the video in the specified video element.
         *
         * @param {MediaStream} [constraints] the media stream constraints to get s valid media stream to decode from
         * @param {string|HTMLVideoElement} [video] the video element in page where to show the video while decoding. Can be either an element id or directly an HTMLVideoElement. Can be undefined, in which case no video will be shown.
         * @returns {Promise<Result>} The decoding result.
         *
         * @memberOf BrowserCodeReader
         */
        decodeOnceFromStream(stream, videoSource) {
            return __awaiter(this, void 0, void 0, function* () {
                this.reset();
                const video = yield this.attachStreamToVideo(stream, videoSource);
                const result = yield this.decodeOnce(video);
                return result;
            });
        }
        /**
         * Continuously decodes the barcode from the device specified by device while showing the video in the specified video element.
         *
         * @param {string|null} [deviceId] the id of one of the devices obtained after calling getVideoInputDevices. Can be undefined, in this case it will decode from one of the available devices, preffering the main camera (environment facing) if available.
         * @param {string|HTMLVideoElement|null} [video] the video element in page where to show the video while decoding. Can be either an element id or directly an HTMLVideoElement. Can be undefined, in which case no video will be shown.
         * @returns {Promise<void>}
         *
         * @memberOf BrowserCodeReader
         *
         * @deprecated Use `decodeFromVideoDevice` instead.
         */
        decodeFromInputVideoDeviceContinuously(deviceId, videoSource, callbackFn) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.decodeFromVideoDevice(deviceId, videoSource, callbackFn);
            });
        }
        /**
         * Continuously tries to decode the barcode from the device specified by device while showing the video in the specified video element.
         *
         * @param {string|null} [deviceId] the id of one of the devices obtained after calling getVideoInputDevices. Can be undefined, in this case it will decode from one of the available devices, preffering the main camera (environment facing) if available.
         * @param {string|HTMLVideoElement|null} [video] the video element in page where to show the video while decoding. Can be either an element id or directly an HTMLVideoElement. Can be undefined, in which case no video will be shown.
         * @returns {Promise<void>}
         *
         * @memberOf BrowserCodeReader
         */
        decodeFromVideoDevice(deviceId, videoSource, callbackFn) {
            return __awaiter(this, void 0, void 0, function* () {
                let videoConstraints;
                if (!deviceId) {
                    videoConstraints = { facingMode: 'environment' };
                }
                else {
                    videoConstraints = { deviceId: { exact: deviceId } };
                }
                const constraints = { video: videoConstraints };
                return yield this.decodeFromConstraints(constraints, videoSource, callbackFn);
            });
        }
        /**
         * Continuously tries to decode the barcode from a stream obtained from the given constraints while showing the video in the specified video element.
         *
         * @param {MediaStream} [constraints] the media stream constraints to get s valid media stream to decode from
         * @param {string|HTMLVideoElement} [video] the video element in page where to show the video while decoding. Can be either an element id or directly an HTMLVideoElement. Can be undefined, in which case no video will be shown.
         * @returns {Promise<Result>} The decoding result.
         *
         * @memberOf BrowserCodeReader
         */
        decodeFromConstraints(constraints, videoSource, callbackFn) {
            return __awaiter(this, void 0, void 0, function* () {
                const stream = yield navigator.mediaDevices.getUserMedia(constraints);
                return yield this.decodeFromStream(stream, videoSource, callbackFn);
            });
        }
        /**
         * In one attempt, tries to decode the barcode from a stream obtained from the given constraints while showing the video in the specified video element.
         *
         * @param {MediaStream} [constraints] the media stream constraints to get s valid media stream to decode from
         * @param {string|HTMLVideoElement} [video] the video element in page where to show the video while decoding. Can be either an element id or directly an HTMLVideoElement. Can be undefined, in which case no video will be shown.
         * @returns {Promise<Result>} The decoding result.
         *
         * @memberOf BrowserCodeReader
         */
        decodeFromStream(stream, videoSource, callbackFn) {
            return __awaiter(this, void 0, void 0, function* () {
                this.reset();
                const video = yield this.attachStreamToVideo(stream, videoSource);
                return yield this.decodeContinuously(video, callbackFn);
            });
        }
        /**
         * Breaks the decoding loop.
         */
        stopAsyncDecode() {
            this._stopAsyncDecode = true;
        }
        /**
         * Breaks the decoding loop.
         */
        stopContinuousDecode() {
            this._stopContinuousDecode = true;
        }
        /**
         * Sets the new stream and request a new decoding-with-delay.
         *
         * @param stream The stream to be shown in the video element.
         * @param decodeFn A callback for the decode method.
         */
        attachStreamToVideo(stream, videoSource) {
            return __awaiter(this, void 0, void 0, function* () {
                const videoElement = this.prepareVideoElement(videoSource);
                this.addVideoSource(videoElement, stream);
                this.videoElement = videoElement;
                this.stream = stream;
                yield this.playVideoOnLoadAsync(videoElement);
                return videoElement;
            });
        }
        /**
         *
         * @param videoElement
         */
        playVideoOnLoadAsync(videoElement) {
            return new Promise((resolve, reject) => this.playVideoOnLoad(videoElement, () => resolve()));
        }
        /**
         * Binds listeners and callbacks to the videoElement.
         *
         * @param element
         * @param callbackFn
         */
        playVideoOnLoad(element, callbackFn) {
            this.videoEndedListener = () => this.stopStreams();
            this.videoCanPlayListener = () => this.tryPlayVideo(element);
            element.addEventListener('ended', this.videoEndedListener);
            element.addEventListener('canplay', this.videoCanPlayListener);
            element.addEventListener('playing', callbackFn);
            // if canplay was already fired, we won't know when to play, so just give it a try
            this.tryPlayVideo(element);
        }
        /**
         * Checks if the given video element is currently playing.
         */
        isVideoPlaying(video) {
            return video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2;
        }
        /**
         * Just tries to play the video and logs any errors.
         * The play call is only made is the video is not already playing.
         */
        tryPlayVideo(videoElement) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.isVideoPlaying(videoElement)) {
                    console.warn('Trying to play video that is already playing.');
                    return;
                }
                try {
                    yield videoElement.play();
                }
                catch (_a) {
                    console.warn('It was not possible to play the video.');
                }
            });
        }
        /**
         * Searches and validates a media element.
         */
        getMediaElement(mediaElementId, type) {
            const mediaElement = document.getElementById(mediaElementId);
            if (!mediaElement) {
                throw new ArgumentException(`element with id '${mediaElementId}' not found`);
            }
            if (mediaElement.nodeName.toLowerCase() !== type.toLowerCase()) {
                throw new ArgumentException(`element with id '${mediaElementId}' must be an ${type} element`);
            }
            return mediaElement;
        }
        /**
         * Decodes the barcode from an image.
         *
         * @param {(string|HTMLImageElement)} [source] The image element that can be either an element id or the element itself. Can be undefined in which case the decoding will be done from the imageUrl parameter.
         * @param {string} [url]
         * @returns {Promise<Result>} The decoding result.
         *
         * @memberOf BrowserCodeReader
         */
        decodeFromImage(source, url) {
            if (!source && !url) {
                throw new ArgumentException('either imageElement with a src set or an url must be provided');
            }
            if (url && !source) {
                return this.decodeFromImageUrl(url);
            }
            return this.decodeFromImageElement(source);
        }
        /**
         * Decodes the barcode from a video.
         *
         * @param {(string|HTMLImageElement)} [source] The image element that can be either an element id or the element itself. Can be undefined in which case the decoding will be done from the imageUrl parameter.
         * @param {string} [url]
         * @returns {Promise<Result>} The decoding result.
         *
         * @memberOf BrowserCodeReader
         */
        decodeFromVideo(source, url) {
            if (!source && !url) {
                throw new ArgumentException('Either an element with a src set or an URL must be provided');
            }
            if (url && !source) {
                return this.decodeFromVideoUrl(url);
            }
            return this.decodeFromVideoElement(source);
        }
        /**
         * Decodes continuously the barcode from a video.
         *
         * @param {(string|HTMLImageElement)} [source] The image element that can be either an element id or the element itself. Can be undefined in which case the decoding will be done from the imageUrl parameter.
         * @param {string} [url]
         * @returns {Promise<Result>} The decoding result.
         *
         * @memberOf BrowserCodeReader
         *
         * @experimental
         */
        decodeFromVideoContinuously(source, url, callbackFn) {
            if (undefined === source && undefined === url) {
                throw new ArgumentException('Either an element with a src set or an URL must be provided');
            }
            if (url && !source) {
                return this.decodeFromVideoUrlContinuously(url, callbackFn);
            }
            return this.decodeFromVideoElementContinuously(source, callbackFn);
        }
        /**
         * Decodes something from an image HTML element.
         */
        decodeFromImageElement(source) {
            if (!source) {
                throw new ArgumentException('An image element must be provided.');
            }
            this.reset();
            const element = this.prepareImageElement(source);
            this.imageElement = element;
            let task;
            if (this.isImageLoaded(element)) {
                task = this.decodeOnce(element, false, true);
            }
            else {
                task = this._decodeOnLoadImage(element);
            }
            return task;
        }
        /**
         * Decodes something from an image HTML element.
         */
        decodeFromVideoElement(source) {
            const element = this._decodeFromVideoElementSetup(source);
            return this._decodeOnLoadVideo(element);
        }
        /**
         * Decodes something from an image HTML element.
         */
        decodeFromVideoElementContinuously(source, callbackFn) {
            const element = this._decodeFromVideoElementSetup(source);
            return this._decodeOnLoadVideoContinuously(element, callbackFn);
        }
        /**
         * Sets up the video source so it can be decoded when loaded.
         *
         * @param source The video source element.
         */
        _decodeFromVideoElementSetup(source) {
            if (!source) {
                throw new ArgumentException('A video element must be provided.');
            }
            this.reset();
            const element = this.prepareVideoElement(source);
            // defines the video element before starts decoding
            this.videoElement = element;
            return element;
        }
        /**
         * Decodes an image from a URL.
         */
        decodeFromImageUrl(url) {
            if (!url) {
                throw new ArgumentException('An URL must be provided.');
            }
            this.reset();
            const element = this.prepareImageElement();
            this.imageElement = element;
            const decodeTask = this._decodeOnLoadImage(element);
            element.src = url;
            return decodeTask;
        }
        /**
         * Decodes an image from a URL.
         */
        decodeFromVideoUrl(url) {
            if (!url) {
                throw new ArgumentException('An URL must be provided.');
            }
            this.reset();
            // creates a new element
            const element = this.prepareVideoElement();
            const decodeTask = this.decodeFromVideoElement(element);
            element.src = url;
            return decodeTask;
        }
        /**
         * Decodes an image from a URL.
         *
         * @experimental
         */
        decodeFromVideoUrlContinuously(url, callbackFn) {
            if (!url) {
                throw new ArgumentException('An URL must be provided.');
            }
            this.reset();
            // creates a new element
            const element = this.prepareVideoElement();
            const decodeTask = this.decodeFromVideoElementContinuously(element, callbackFn);
            element.src = url;
            return decodeTask;
        }
        _decodeOnLoadImage(element) {
            return new Promise((resolve, reject) => {
                this.imageLoadedListener = () => this.decodeOnce(element, false, true).then(resolve, reject);
                element.addEventListener('load', this.imageLoadedListener);
            });
        }
        _decodeOnLoadVideo(videoElement) {
            return __awaiter(this, void 0, void 0, function* () {
                // plays the video
                yield this.playVideoOnLoadAsync(videoElement);
                // starts decoding after played the video
                return yield this.decodeOnce(videoElement);
            });
        }
        _decodeOnLoadVideoContinuously(videoElement, callbackFn) {
            return __awaiter(this, void 0, void 0, function* () {
                // plays the video
                yield this.playVideoOnLoadAsync(videoElement);
                // starts decoding after played the video
                this.decodeContinuously(videoElement, callbackFn);
            });
        }
        isImageLoaded(img) {
            // During the onload event, IE correctly identifies any images that
            // weren’t downloaded as not complete. Others should too. Gecko-based
            // browsers act like NS4 in that they report this incorrectly.
            if (!img.complete) {
                return false;
            }
            // However, they do have two very useful properties: naturalWidth and
            // naturalHeight. These give the true size of the image. If it failed
            // to load, either of these should be zero.
            if (img.naturalWidth === 0) {
                return false;
            }
            // No other way of checking: assume it’s ok.
            return true;
        }
        prepareImageElement(imageSource) {
            let imageElement;
            if (typeof imageSource === 'undefined') {
                imageElement = document.createElement('img');
                imageElement.width = 200;
                imageElement.height = 200;
            }
            if (typeof imageSource === 'string') {
                imageElement = this.getMediaElement(imageSource, 'img');
            }
            if (imageSource instanceof HTMLImageElement) {
                imageElement = imageSource;
            }
            return imageElement;
        }
        /**
         * Sets a HTMLVideoElement for scanning or creates a new one.
         *
         * @param videoSource The HTMLVideoElement to be set.
         */
        prepareVideoElement(videoSource) {
            let videoElement;
            if (!videoSource && typeof document !== 'undefined') {
                videoElement = document.createElement('video');
                videoElement.width = 200;
                videoElement.height = 200;
            }
            if (typeof videoSource === 'string') {
                videoElement = this.getMediaElement(videoSource, 'video');
            }
            if (videoSource instanceof HTMLVideoElement) {
                videoElement = videoSource;
            }
            // Needed for iOS 11
            videoElement.setAttribute('autoplay', 'true');
            videoElement.setAttribute('muted', 'true');
            videoElement.setAttribute('playsinline', 'true');
            return videoElement;
        }
        /**
         * Tries to decode from the video input until it finds some value.
         */
        decodeOnce(element, retryIfNotFound = true, retryIfChecksumOrFormatError = true) {
            this._stopAsyncDecode = false;
            const loop = (resolve, reject) => {
                if (this._stopAsyncDecode) {
                    reject(new NotFoundException('Video stream has ended before any code could be detected.'));
                    this._stopAsyncDecode = undefined;
                    return;
                }
                try {
                    const result = this.decode(element);
                    resolve(result);
                }
                catch (e) {
                    const ifNotFound = retryIfNotFound && e instanceof NotFoundException;
                    const isChecksumOrFormatError = e instanceof ChecksumException || e instanceof FormatException;
                    const ifChecksumOrFormat = isChecksumOrFormatError && retryIfChecksumOrFormatError;
                    if (ifNotFound || ifChecksumOrFormat) {
                        // trying again
                        return setTimeout(loop, this._timeBetweenDecodingAttempts, resolve, reject);
                    }
                    reject(e);
                }
            };
            return new Promise((resolve, reject) => loop(resolve, reject));
        }
        /**
         * Continuously decodes from video input.
         */
        decodeContinuously(element, callbackFn) {
            this._stopContinuousDecode = false;
            const loop = () => {
                if (this._stopContinuousDecode) {
                    this._stopContinuousDecode = undefined;
                    return;
                }
                try {
                    const result = this.decode(element);
                    callbackFn(result, null);
                    setTimeout(loop, this.timeBetweenScansMillis);
                }
                catch (e) {
                    callbackFn(null, e);
                    const isChecksumOrFormatError = e instanceof ChecksumException || e instanceof FormatException;
                    const isNotFound = e instanceof NotFoundException;
                    if (isChecksumOrFormatError || isNotFound) {
                        // trying again
                        setTimeout(loop, this._timeBetweenDecodingAttempts);
                    }
                }
            };
            loop();
        }
        /**
         * Gets the BinaryBitmap for ya! (and decodes it)
         */
        decode(element) {
            // get binary bitmap for decode function
            const binaryBitmap = this.createBinaryBitmap(element);
            return this.decodeBitmap(binaryBitmap);
        }
        /**
         * Creates a binaryBitmap based in some image source.
         *
         * @param mediaElement HTML element containing drawable image source.
         */
        createBinaryBitmap(mediaElement) {
            const ctx = this.getCaptureCanvasContext(mediaElement);
            this.drawImageOnCanvas(ctx, mediaElement);
            const canvas = this.getCaptureCanvas(mediaElement);
            const luminanceSource = new HTMLCanvasElementLuminanceSource(canvas);
            const hybridBinarizer = new HybridBinarizer(luminanceSource);
            return new BinaryBitmap(hybridBinarizer);
        }
        /**
         *
         */
        getCaptureCanvasContext(mediaElement) {
            if (!this.captureCanvasContext) {
                const elem = this.getCaptureCanvas(mediaElement);
                const ctx = elem.getContext('2d');
                this.captureCanvasContext = ctx;
            }
            return this.captureCanvasContext;
        }
        /**
         *
         */
        getCaptureCanvas(mediaElement) {
            if (!this.captureCanvas) {
                const elem = this.createCaptureCanvas(mediaElement);
                this.captureCanvas = elem;
            }
            return this.captureCanvas;
        }
        /**
         * Ovewriting this allows you to manipulate the snapshot image in anyway you want before decode.
         */
        drawImageOnCanvas(canvasElementContext, srcElement) {
            canvasElementContext.drawImage(srcElement, 0, 0);
        }
        /**
         * Call the encapsulated readers decode
         */
        decodeBitmap(binaryBitmap) {
            return this.reader.decode(binaryBitmap, this._hints);
        }
        /**
         * 🖌 Prepares the canvas for capture and scan frames.
         */
        createCaptureCanvas(mediaElement) {
            if (typeof document === 'undefined') {
                this._destroyCaptureCanvas();
                return null;
            }
            const canvasElement = document.createElement('canvas');
            let width;
            let height;
            if (typeof mediaElement !== 'undefined') {
                if (mediaElement instanceof HTMLVideoElement) {
                    width = mediaElement.videoWidth;
                    height = mediaElement.videoHeight;
                }
                else if (mediaElement instanceof HTMLImageElement) {
                    width = mediaElement.naturalWidth || mediaElement.width;
                    height = mediaElement.naturalHeight || mediaElement.height;
                }
            }
            canvasElement.style.width = width + 'px';
            canvasElement.style.height = height + 'px';
            canvasElement.width = width;
            canvasElement.height = height;
            return canvasElement;
        }
        /**
         * Stops the continuous scan and cleans the stream.
         */
        stopStreams() {
            if (this.stream) {
                this.stream.getVideoTracks().forEach(t => t.stop());
                this.stream = undefined;
            }
            if (this._stopAsyncDecode === false) {
                this.stopAsyncDecode();
            }
            if (this._stopContinuousDecode === false) {
                this.stopContinuousDecode();
            }
        }
        /**
         * Resets the code reader to the initial state. Cancels any ongoing barcode scanning from video or camera.
         *
         * @memberOf BrowserCodeReader
         */
        reset() {
            // stops the camera, preview and scan 🔴
            this.stopStreams();
            // clean and forget about HTML elements
            this._destroyVideoElement();
            this._destroyImageElement();
            this._destroyCaptureCanvas();
        }
        _destroyVideoElement() {
            if (!this.videoElement) {
                return;
            }
            // first gives freedon to the element 🕊
            if (typeof this.videoEndedListener !== 'undefined') {
                this.videoElement.removeEventListener('ended', this.videoEndedListener);
            }
            if (typeof this.videoPlayingEventListener !== 'undefined') {
                this.videoElement.removeEventListener('playing', this.videoPlayingEventListener);
            }
            if (typeof this.videoCanPlayListener !== 'undefined') {
                this.videoElement.removeEventListener('loadedmetadata', this.videoCanPlayListener);
            }
            // then forgets about that element 😢
            this.cleanVideoSource(this.videoElement);
            this.videoElement = undefined;
        }
        _destroyImageElement() {
            if (!this.imageElement) {
                return;
            }
            // first gives freedon to the element 🕊
            if (undefined !== this.imageLoadedListener) {
                this.imageElement.removeEventListener('load', this.imageLoadedListener);
            }
            // then forget about that element 😢
            this.imageElement.src = undefined;
            this.imageElement.removeAttribute('src');
            this.imageElement = undefined;
        }
        /**
         * Cleans canvas references 🖌
         */
        _destroyCaptureCanvas() {
            // then forget about that element 😢
            this.captureCanvasContext = undefined;
            this.captureCanvas = undefined;
        }
        /**
         * Defines what the videoElement src will be.
         *
         * @param videoElement
         * @param stream
         */
        addVideoSource(videoElement, stream) {
            // Older browsers may not have `srcObject`
            try {
                // @note Throws Exception if interrupted by a new loaded request
                videoElement.srcObject = stream;
            }
            catch (err) {
                // @note Avoid using this in new browsers, as it is going away.
                videoElement.src = URL.createObjectURL(stream);
            }
        }
        /**
         * Unbinds a HTML video src property.
         *
         * @param videoElement
         */
        cleanVideoSource(videoElement) {
            try {
                videoElement.srcObject = null;
            }
            catch (err) {
                videoElement.src = '';
            }
            this.videoElement.removeAttribute('src');
        }
    }
  
    /*
     * Copyright 2007 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * <p>Encapsulates the result of decoding a barcode within an image.</p>
     *
     * @author Sean Owen
     */
    class Result {
        // public constructor(private text: string,
        //               Uint8Array rawBytes,
        //               ResultPoconst resultPoints: Int32Array,
        //               BarcodeFormat format) {
        //   this(text, rawBytes, resultPoints, format, System.currentTimeMillis())
        // }
        // public constructor(text: string,
        //               Uint8Array rawBytes,
        //               ResultPoconst resultPoints: Int32Array,
        //               BarcodeFormat format,
        //               long timestamp) {
        //   this(text, rawBytes, rawBytes == null ? 0 : 8 * rawBytes.length,
        //        resultPoints, format, timestamp)
        // }
        constructor(text, rawBytes, numBits = rawBytes == null ? 0 : 8 * rawBytes.length, resultPoints, format, timestamp = System.currentTimeMillis()) {
            this.text = text;
            this.rawBytes = rawBytes;
            this.numBits = numBits;
            this.resultPoints = resultPoints;
            this.format = format;
            this.timestamp = timestamp;
            this.text = text;
            this.rawBytes = rawBytes;
            if (undefined === numBits || null === numBits) {
                this.numBits = (rawBytes === null || rawBytes === undefined) ? 0 : 8 * rawBytes.length;
            }
            else {
                this.numBits = numBits;
            }
            this.resultPoints = resultPoints;
            this.format = format;
            this.resultMetadata = null;
            if (undefined === timestamp || null === timestamp) {
                this.timestamp = System.currentTimeMillis();
            }
            else {
                this.timestamp = timestamp;
            }
        }
        /**
         * @return raw text encoded by the barcode
         */
        getText() {
            return this.text;
        }
        /**
         * @return raw bytes encoded by the barcode, if applicable, otherwise {@code null}
         */
        getRawBytes() {
            return this.rawBytes;
        }
        /**
         * @return how many bits of {@link #getRawBytes()} are valid; typically 8 times its length
         * @since 3.3.0
         */
        getNumBits() {
            return this.numBits;
        }
        /**
         * @return points related to the barcode in the image. These are typically points
         *         identifying finder patterns or the corners of the barcode. The exact meaning is
         *         specific to the type of barcode that was decoded.
         */
        getResultPoints() {
            return this.resultPoints;
        }
        /**
         * @return {@link BarcodeFormat} representing the format of the barcode that was decoded
         */
        getBarcodeFormat() {
            return this.format;
        }
        /**
         * @return {@link Map} mapping {@link ResultMetadataType} keys to values. May be
         *   {@code null}. This contains optional metadata about what was detected about the barcode,
         *   like orientation.
         */
        getResultMetadata() {
            return this.resultMetadata;
        }
        putMetadata(type, value) {
            if (this.resultMetadata === null) {
                this.resultMetadata = new Map();
            }
            this.resultMetadata.set(type, value);
        }
        putAllMetadata(metadata) {
            if (metadata !== null) {
                if (this.resultMetadata === null) {
                    this.resultMetadata = metadata;
                }
                else {
                    this.resultMetadata = new Map(metadata);
                }
            }
        }
        addResultPoints(newPoints) {
            const oldPoints = this.resultPoints;
            if (oldPoints === null) {
                this.resultPoints = newPoints;
            }
            else if (newPoints !== null && newPoints.length > 0) {
                const allPoints = new Array(oldPoints.length + newPoints.length);
                System.arraycopy(oldPoints, 0, allPoints, 0, oldPoints.length);
                System.arraycopy(newPoints, 0, allPoints, oldPoints.length, newPoints.length);
                this.resultPoints = allPoints;
            }
        }
        getTimestamp() {
            return this.timestamp;
        }
        /*@Override*/
        toString() {
            return this.text;
        }
    }
  
    /*
     * Direct port to TypeScript of ZXing by Adrian Toșcă
     */
    /*
     * Copyright 2009 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /*namespace com.google.zxing {*/
    /**
     * Enumerates barcode formats known to this package. Please keep alphabetized.
     *
     * @author Sean Owen
     */
    var BarcodeFormat;
    (function (BarcodeFormat) {
        /** Aztec 2D barcode format. */
        BarcodeFormat[BarcodeFormat["AZTEC"] = 0] = "AZTEC";
        /** CODABAR 1D format. */
        BarcodeFormat[BarcodeFormat["CODABAR"] = 1] = "CODABAR";
        /** Code 39 1D format. */
        BarcodeFormat[BarcodeFormat["CODE_39"] = 2] = "CODE_39";
        /** Code 93 1D format. */
        BarcodeFormat[BarcodeFormat["CODE_93"] = 3] = "CODE_93";
        /** Code 128 1D format. */
        BarcodeFormat[BarcodeFormat["CODE_128"] = 4] = "CODE_128";
        /** Data Matrix 2D barcode format. */
        BarcodeFormat[BarcodeFormat["DATA_MATRIX"] = 5] = "DATA_MATRIX";
        /** EAN-8 1D format. */
        BarcodeFormat[BarcodeFormat["EAN_8"] = 6] = "EAN_8";
        /** EAN-13 1D format. */
        BarcodeFormat[BarcodeFormat["EAN_13"] = 7] = "EAN_13";
        /** ITF (Interleaved Two of Five) 1D format. */
        BarcodeFormat[BarcodeFormat["ITF"] = 8] = "ITF";
        /** MaxiCode 2D barcode format. */
        BarcodeFormat[BarcodeFormat["MAXICODE"] = 9] = "MAXICODE";
        /** PDF417 format. */
        BarcodeFormat[BarcodeFormat["PDF_417"] = 10] = "PDF_417";
        /** QR Code 2D barcode format. */
        BarcodeFormat[BarcodeFormat["QR_CODE"] = 11] = "QR_CODE";
        /** RSS 14 */
        BarcodeFormat[BarcodeFormat["RSS_14"] = 12] = "RSS_14";
        /** RSS EXPANDED */
        BarcodeFormat[BarcodeFormat["RSS_EXPANDED"] = 13] = "RSS_EXPANDED";
        /** UPC-A 1D format. */
        BarcodeFormat[BarcodeFormat["UPC_A"] = 14] = "UPC_A";
        /** UPC-E 1D format. */
        BarcodeFormat[BarcodeFormat["UPC_E"] = 15] = "UPC_E";
        /** UPC/EAN extension format. Not a stand-alone format. */
        BarcodeFormat[BarcodeFormat["UPC_EAN_EXTENSION"] = 16] = "UPC_EAN_EXTENSION";
    })(BarcodeFormat || (BarcodeFormat = {}));
    var BarcodeFormat$1 = BarcodeFormat;
  
    /*
     * Copyright 2008 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /*namespace com.google.zxing {*/
    /**
     * Represents some type of metadata about the result of the decoding that the decoder
     * wishes to communicate back to the caller.
     *
     * @author Sean Owen
     */
    var ResultMetadataType;
    (function (ResultMetadataType) {
        /**
         * Unspecified, application-specific metadata. Maps to an unspecified {@link Object}.
         */
        ResultMetadataType[ResultMetadataType["OTHER"] = 0] = "OTHER";
        /**
         * Denotes the likely approximate orientation of the barcode in the image. This value
         * is given as degrees rotated clockwise from the normal, upright orientation.
         * For example a 1D barcode which was found by reading top-to-bottom would be
         * said to have orientation "90". This key maps to an {@link Integer} whose
         * value is in the range [0,360).
         */
        ResultMetadataType[ResultMetadataType["ORIENTATION"] = 1] = "ORIENTATION";
        /**
         * <p>2D barcode formats typically encode text, but allow for a sort of 'byte mode'
         * which is sometimes used to encode binary data. While {@link Result} makes available
         * the complete raw bytes in the barcode for these formats, it does not offer the bytes
         * from the byte segments alone.</p>
         *
         * <p>This maps to a {@link java.util.List} of byte arrays corresponding to the
         * raw bytes in the byte segments in the barcode, in order.</p>
         */
        ResultMetadataType[ResultMetadataType["BYTE_SEGMENTS"] = 2] = "BYTE_SEGMENTS";
        /**
         * Error correction level used, if applicable. The value type depends on the
         * format, but is typically a String.
         */
        ResultMetadataType[ResultMetadataType["ERROR_CORRECTION_LEVEL"] = 3] = "ERROR_CORRECTION_LEVEL";
        /**
         * For some periodicals, indicates the issue number as an {@link Integer}.
         */
        ResultMetadataType[ResultMetadataType["ISSUE_NUMBER"] = 4] = "ISSUE_NUMBER";
        /**
         * For some products, indicates the suggested retail price in the barcode as a
         * formatted {@link String}.
         */
        ResultMetadataType[ResultMetadataType["SUGGESTED_PRICE"] = 5] = "SUGGESTED_PRICE";
        /**
         * For some products, the possible country of manufacture as a {@link String} denoting the
         * ISO country code. Some map to multiple possible countries, like "US/CA".
         */
        ResultMetadataType[ResultMetadataType["POSSIBLE_COUNTRY"] = 6] = "POSSIBLE_COUNTRY";
        /**
         * For some products, the extension text
         */
        ResultMetadataType[ResultMetadataType["UPC_EAN_EXTENSION"] = 7] = "UPC_EAN_EXTENSION";
        /**
         * PDF417-specific metadata
         */
        ResultMetadataType[ResultMetadataType["PDF417_EXTRA_METADATA"] = 8] = "PDF417_EXTRA_METADATA";
        /**
         * If the code format supports structured append and the current scanned code is part of one then the
         * sequence number is given with it.
         */
        ResultMetadataType[ResultMetadataType["STRUCTURED_APPEND_SEQUENCE"] = 9] = "STRUCTURED_APPEND_SEQUENCE";
        /**
         * If the code format supports structured append and the current scanned code is part of one then the
         * parity is given with it.
         */
        ResultMetadataType[ResultMetadataType["STRUCTURED_APPEND_PARITY"] = 10] = "STRUCTURED_APPEND_PARITY";
    })(ResultMetadataType || (ResultMetadataType = {}));
    var ResultMetadataType$1 = ResultMetadataType;
  
    /*
     * Copyright 2007 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /*namespace com.google.zxing.common {*/
    /*import java.util.List;*/
    /**
     * <p>Encapsulates the result of decoding a matrix of bits. This typically
     * applies to 2D barcode formats. For now it contains the raw bytes obtained,
     * as well as a String interpretation of those bytes, if applicable.</p>
     *
     * @author Sean Owen
     */
    class DecoderResult {
        // public constructor(rawBytes: Uint8Array,
        //                      text: string,
        //                      List<Uint8Array> byteSegments,
        //                      String ecLevel) {
        //   this(rawBytes, text, byteSegments, ecLevel, -1, -1)
        // }
        constructor(rawBytes, text, byteSegments, ecLevel, structuredAppendSequenceNumber = -1, structuredAppendParity = -1) {
            this.rawBytes = rawBytes;
            this.text = text;
            this.byteSegments = byteSegments;
            this.ecLevel = ecLevel;
            this.structuredAppendSequenceNumber = structuredAppendSequenceNumber;
            this.structuredAppendParity = structuredAppendParity;
            this.numBits = (rawBytes === undefined || rawBytes === null) ? 0 : 8 * rawBytes.length;
        }
        /**
         * @return raw bytes representing the result, or {@code null} if not applicable
         */
        getRawBytes() {
            return this.rawBytes;
        }
        /**
         * @return how many bits of {@link #getRawBytes()} are valid; typically 8 times its length
         * @since 3.3.0
         */
        getNumBits() {
            return this.numBits;
        }
        /**
         * @param numBits overrides the number of bits that are valid in {@link #getRawBytes()}
         * @since 3.3.0
         */
        setNumBits(numBits /*int*/) {
            this.numBits = numBits;
        }
        /**
         * @return text representation of the result
         */
        getText() {
            return this.text;
        }
        /**
         * @return list of byte segments in the result, or {@code null} if not applicable
         */
        getByteSegments() {
            return this.byteSegments;
        }
        /**
         * @return name of error correction level used, or {@code null} if not applicable
         */
        getECLevel() {
            return this.ecLevel;
        }
        /**
         * @return number of errors corrected, or {@code null} if not applicable
         */
        getErrorsCorrected() {
            return this.errorsCorrected;
        }
        setErrorsCorrected(errorsCorrected /*Integer*/) {
            this.errorsCorrected = errorsCorrected;
        }
        /**
         * @return number of erasures corrected, or {@code null} if not applicable
         */
        getErasures() {
            return this.erasures;
        }
        setErasures(erasures /*Integer*/) {
            this.erasures = erasures;
        }
        /**
         * @return arbitrary additional metadata
         */
        getOther() {
            return this.other;
        }
        setOther(other) {
            this.other = other;
        }
        hasStructuredAppend() {
            return this.structuredAppendParity >= 0 && this.structuredAppendSequenceNumber >= 0;
        }
        getStructuredAppendParity() {
            return this.structuredAppendParity;
        }
        getStructuredAppendSequenceNumber() {
            return this.structuredAppendSequenceNumber;
        }
    }
  
    /*
     * Copyright 2007 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * <p>This class contains utility methods for performing mathematical operations over
     * the Galois Fields. Operations use a given primitive polynomial in calculations.</p>
     *
     * <p>Throughout this package, elements of the GF are represented as an {@code int}
     * for convenience and speed (but at the cost of memory).
     * </p>
     *
     * @author Sean Owen
     * @author David Olivier
     */
    class AbstractGenericGF {
        /**
         * @return 2 to the power of a in GF(size)
         */
        exp(a) {
            return this.expTable[a];
        }
        /**
         * @return base 2 log of a in GF(size)
         */
        log(a /*int*/) {
            if (a === 0) {
                throw new IllegalArgumentException();
            }
            return this.logTable[a];
        }
        /**
         * Implements both addition and subtraction -- they are the same in GF(size).
         *
         * @return sum/difference of a and b
         */
        static addOrSubtract(a /*int*/, b /*int*/) {
            return a ^ b;
        }
    }
  
    /*
     * Copyright 2007 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * <p>Represents a polynomial whose coefficients are elements of a GF.
     * Instances of this class are immutable.</p>
     *
     * <p>Much credit is due to William Rucklidge since portions of this code are an indirect
     * port of his C++ Reed-Solomon implementation.</p>
     *
     * @author Sean Owen
     */
    class GenericGFPoly {
        /**
         * @param field the {@link GenericGF} instance representing the field to use
         * to perform computations
         * @param coefficients coefficients as ints representing elements of GF(size), arranged
         * from most significant (highest-power term) coefficient to least significant
         * @throws IllegalArgumentException if argument is null or empty,
         * or if leading coefficient is 0 and this is not a
         * constant polynomial (that is, it is not the monomial "0")
         */
        constructor(field, coefficients) {
            if (coefficients.length === 0) {
                throw new IllegalArgumentException();
            }
            this.field = field;
            const coefficientsLength = coefficients.length;
            if (coefficientsLength > 1 && coefficients[0] === 0) {
                // Leading term must be non-zero for anything except the constant polynomial "0"
                let firstNonZero = 1;
                while (firstNonZero < coefficientsLength && coefficients[firstNonZero] === 0) {
                    firstNonZero++;
                }
                if (firstNonZero === coefficientsLength) {
                    this.coefficients = Int32Array.from([0]);
                }
                else {
                    this.coefficients = new Int32Array(coefficientsLength - firstNonZero);
                    System.arraycopy(coefficients, firstNonZero, this.coefficients, 0, this.coefficients.length);
                }
            }
            else {
                this.coefficients = coefficients;
            }
        }
        getCoefficients() {
            return this.coefficients;
        }
        /**
         * @return degree of this polynomial
         */
        getDegree() {
            return this.coefficients.length - 1;
        }
        /**
         * @return true iff this polynomial is the monomial "0"
         */
        isZero() {
            return this.coefficients[0] === 0;
        }
        /**
         * @return coefficient of x^degree term in this polynomial
         */
        getCoefficient(degree /*int*/) {
            return this.coefficients[this.coefficients.length - 1 - degree];
        }
        /**
         * @return evaluation of this polynomial at a given point
         */
        evaluateAt(a /*int*/) {
            if (a === 0) {
                // Just return the x^0 coefficient
                return this.getCoefficient(0);
            }
            const coefficients = this.coefficients;
            let result;
            if (a === 1) {
                // Just the sum of the coefficients
                result = 0;
                for (let i = 0, length = coefficients.length; i !== length; i++) {
                    const coefficient = coefficients[i];
                    result = AbstractGenericGF.addOrSubtract(result, coefficient);
                }
                return result;
            }
            result = coefficients[0];
            const size = coefficients.length;
            const field = this.field;
            for (let i = 1; i < size; i++) {
                result = AbstractGenericGF.addOrSubtract(field.multiply(a, result), coefficients[i]);
            }
            return result;
        }
        addOrSubtract(other) {
            if (!this.field.equals(other.field)) {
                throw new IllegalArgumentException('GenericGFPolys do not have same GenericGF field');
            }
            if (this.isZero()) {
                return other;
            }
            if (other.isZero()) {
                return this;
            }
            let smallerCoefficients = this.coefficients;
            let largerCoefficients = other.coefficients;
            if (smallerCoefficients.length > largerCoefficients.length) {
                const temp = smallerCoefficients;
                smallerCoefficients = largerCoefficients;
                largerCoefficients = temp;
            }
            let sumDiff = new Int32Array(largerCoefficients.length);
            const lengthDiff = largerCoefficients.length - smallerCoefficients.length;
            // Copy high-order terms only found in higher-degree polynomial's coefficients
            System.arraycopy(largerCoefficients, 0, sumDiff, 0, lengthDiff);
            for (let i = lengthDiff; i < largerCoefficients.length; i++) {
                sumDiff[i] = AbstractGenericGF.addOrSubtract(smallerCoefficients[i - lengthDiff], largerCoefficients[i]);
            }
            return new GenericGFPoly(this.field, sumDiff);
        }
        multiply(other) {
            if (!this.field.equals(other.field)) {
                throw new IllegalArgumentException('GenericGFPolys do not have same GenericGF field');
            }
            if (this.isZero() || other.isZero()) {
                return this.field.getZero();
            }
            const aCoefficients = this.coefficients;
            const aLength = aCoefficients.length;
            const bCoefficients = other.coefficients;
            const bLength = bCoefficients.length;
            const product = new Int32Array(aLength + bLength - 1);
            const field = this.field;
            for (let i = 0; i < aLength; i++) {
                const aCoeff = aCoefficients[i];
                for (let j = 0; j < bLength; j++) {
                    product[i + j] = AbstractGenericGF.addOrSubtract(product[i + j], field.multiply(aCoeff, bCoefficients[j]));
                }
            }
            return new GenericGFPoly(field, product);
        }
        multiplyScalar(scalar /*int*/) {
            if (scalar === 0) {
                return this.field.getZero();
            }
            if (scalar === 1) {
                return this;
            }
            const size = this.coefficients.length;
            const field = this.field;
            const product = new Int32Array(size);
            const coefficients = this.coefficients;
            for (let i = 0; i < size; i++) {
                product[i] = field.multiply(coefficients[i], scalar);
            }
            return new GenericGFPoly(field, product);
        }
        multiplyByMonomial(degree /*int*/, coefficient /*int*/) {
            if (degree < 0) {
                throw new IllegalArgumentException();
            }
            if (coefficient === 0) {
                return this.field.getZero();
            }
            const coefficients = this.coefficients;
            const size = coefficients.length;
            const product = new Int32Array(size + degree);
            const field = this.field;
            for (let i = 0; i < size; i++) {
                product[i] = field.multiply(coefficients[i], coefficient);
            }
            return new GenericGFPoly(field, product);
        }
        divide(other) {
            if (!this.field.equals(other.field)) {
                throw new IllegalArgumentException('GenericGFPolys do not have same GenericGF field');
            }
            if (other.isZero()) {
                throw new IllegalArgumentException('Divide by 0');
            }
            const field = this.field;
            let quotient = field.getZero();
            let remainder = this;
            const denominatorLeadingTerm = other.getCoefficient(other.getDegree());
            const inverseDenominatorLeadingTerm = field.inverse(denominatorLeadingTerm);
            while (remainder.getDegree() >= other.getDegree() && !remainder.isZero()) {
                const degreeDifference = remainder.getDegree() - other.getDegree();
                const scale = field.multiply(remainder.getCoefficient(remainder.getDegree()), inverseDenominatorLeadingTerm);
                const term = other.multiplyByMonomial(degreeDifference, scale);
                const iterationQuotient = field.buildMonomial(degreeDifference, scale);
                quotient = quotient.addOrSubtract(iterationQuotient);
                remainder = remainder.addOrSubtract(term);
            }
            return [quotient, remainder];
        }
        /*@Override*/
        toString() {
            let result = '';
            for (let degree = this.getDegree(); degree >= 0; degree--) {
                let coefficient = this.getCoefficient(degree);
                if (coefficient !== 0) {
                    if (coefficient < 0) {
                        result += ' - ';
                        coefficient = -coefficient;
                    }
                    else {
                        if (result.length > 0) {
                            result += ' + ';
                        }
                    }
                    if (degree === 0 || coefficient !== 1) {
                        const alphaPower = this.field.log(coefficient);
                        if (alphaPower === 0) {
                            result += '1';
                        }
                        else if (alphaPower === 1) {
                            result += 'a';
                        }
                        else {
                            result += 'a^';
                            result += alphaPower;
                        }
                    }
                    if (degree !== 0) {
                        if (degree === 1) {
                            result += 'x';
                        }
                        else {
                            result += 'x^';
                            result += degree;
                        }
                    }
                }
            }
            return result;
        }
    }
  
    /**
     * Custom Error class of type Exception.
     */
    class ArithmeticException extends Exception {
    }
    ArithmeticException.kind = 'ArithmeticException';
  
    /*
     * Copyright 2007 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * <p>This class contains utility methods for performing mathematical operations over
     * the Galois Fields. Operations use a given primitive polynomial in calculations.</p>
     *
     * <p>Throughout this package, elements of the GF are represented as an {@code int}
     * for convenience and speed (but at the cost of memory).
     * </p>
     *
     * @author Sean Owen
     * @author David Olivier
     */
    class GenericGF extends AbstractGenericGF {
        /**
         * Create a representation of GF(size) using the given primitive polynomial.
         *
         * @param primitive irreducible polynomial whose coefficients are represented by
         *  the bits of an int, where the least-significant bit represents the constant
         *  coefficient
         * @param size the size of the field
         * @param b the factor b in the generator polynomial can be 0- or 1-based
         *  (g(x) = (x+a^b)(x+a^(b+1))...(x+a^(b+2t-1))).
         *  In most cases it should be 1, but for QR code it is 0.
         */
        constructor(primitive /*int*/, size /*int*/, generatorBase /*int*/) {
            super();
            this.primitive = primitive;
            this.size = size;
            this.generatorBase = generatorBase;
            const expTable = new Int32Array(size);
            let x = 1;
            for (let i = 0; i < size; i++) {
                expTable[i] = x;
                x *= 2; // we're assuming the generator alpha is 2
                if (x >= size) {
                    x ^= primitive;
                    x &= size - 1;
                }
            }
            this.expTable = expTable;
            const logTable = new Int32Array(size);
            for (let i = 0; i < size - 1; i++) {
                logTable[expTable[i]] = i;
            }
            this.logTable = logTable;
            // logTable[0] == 0 but this should never be used
            this.zero = new GenericGFPoly(this, Int32Array.from([0]));
            this.one = new GenericGFPoly(this, Int32Array.from([1]));
        }
        getZero() {
            return this.zero;
        }
        getOne() {
            return this.one;
        }
        /**
         * @return the monomial representing coefficient * x^degree
         */
        buildMonomial(degree /*int*/, coefficient /*int*/) {
            if (degree < 0) {
                throw new IllegalArgumentException();
            }
            if (coefficient === 0) {
                return this.zero;
            }
            const coefficients = new Int32Array(degree + 1);
            coefficients[0] = coefficient;
            return new GenericGFPoly(this, coefficients);
        }
        /**
         * @return multiplicative inverse of a
         */
        inverse(a /*int*/) {
            if (a === 0) {
                throw new ArithmeticException();
            }
            return this.expTable[this.size - this.logTable[a] - 1];
        }
        /**
         * @return product of a and b in GF(size)
         */
        multiply(a /*int*/, b /*int*/) {
            if (a === 0 || b === 0) {
                return 0;
            }
            return this.expTable[(this.logTable[a] + this.logTable[b]) % (this.size - 1)];
        }
        getSize() {
            return this.size;
        }
        getGeneratorBase() {
            return this.generatorBase;
        }
        /*@Override*/
        toString() {
            return ('GF(0x' + Integer.toHexString(this.primitive) + ',' + this.size + ')');
        }
        equals(o) {
            return o === this;
        }
    }
    GenericGF.AZTEC_DATA_12 = new GenericGF(0x1069, 4096, 1); // x^12 + x^6 + x^5 + x^3 + 1
    GenericGF.AZTEC_DATA_10 = new GenericGF(0x409, 1024, 1); // x^10 + x^3 + 1
    GenericGF.AZTEC_DATA_6 = new GenericGF(0x43, 64, 1); // x^6 + x + 1
    GenericGF.AZTEC_PARAM = new GenericGF(0x13, 16, 1); // x^4 + x + 1
    GenericGF.QR_CODE_FIELD_256 = new GenericGF(0x011d, 256, 0); // x^8 + x^4 + x^3 + x^2 + 1
    GenericGF.DATA_MATRIX_FIELD_256 = new GenericGF(0x012d, 256, 1); // x^8 + x^5 + x^3 + x^2 + 1
    GenericGF.AZTEC_DATA_8 = GenericGF.DATA_MATRIX_FIELD_256;
    GenericGF.MAXICODE_FIELD_64 = GenericGF.AZTEC_DATA_6;
  
    /**
     * Custom Error class of type Exception.
     */
    class ReedSolomonException extends Exception {
    }
    ReedSolomonException.kind = 'ReedSolomonException';
  
    /**
     * Custom Error class of type Exception.
     */
    class IllegalStateException extends Exception {
    }
    IllegalStateException.kind = 'IllegalStateException';
  
    /*
     * Copyright 2007 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * <p>Implements Reed-Solomon decoding, as the name implies.</p>
     *
     * <p>The algorithm will not be explained here, but the following references were helpful
     * in creating this implementation:</p>
     *
     * <ul>
     * <li>Bruce Maggs.
     * <a href="http://www.cs.cmu.edu/afs/cs.cmu.edu/project/pscico-guyb/realworld/www/rs_decode.ps">
     * "Decoding Reed-Solomon Codes"</a> (see discussion of Forney's Formula)</li>
     * <li>J.I. Hall. <a href="www.mth.msu.edu/~jhall/classes/codenotes/GRS.pdf">
     * "Chapter 5. Generalized Reed-Solomon Codes"</a>
     * (see discussion of Euclidean algorithm)</li>
     * </ul>
     *
     * <p>Much credit is due to William Rucklidge since portions of this code are an indirect
     * port of his C++ Reed-Solomon implementation.</p>
     *
     * @author Sean Owen
     * @author William Rucklidge
     * @author sanfordsquires
     */
    class ReedSolomonDecoder {
        constructor(field) {
            this.field = field;
        }
        /**
         * <p>Decodes given set of received codewords, which include both data and error-correction
         * codewords. Really, this means it uses Reed-Solomon to detect and correct errors, in-place,
         * in the input.</p>
         *
         * @param received data and error-correction codewords
         * @param twoS number of error-correction codewords available
         * @throws ReedSolomonException if decoding fails for any reason
         */
        decode(received, twoS /*int*/) {
            const field = this.field;
            const poly = new GenericGFPoly(field, received);
            const syndromeCoefficients = new Int32Array(twoS);
            let noError = true;
            for (let i = 0; i < twoS; i++) {
                const evalResult = poly.evaluateAt(field.exp(i + field.getGeneratorBase()));
                syndromeCoefficients[syndromeCoefficients.length - 1 - i] = evalResult;
                if (evalResult !== 0) {
                    noError = false;
                }
            }
            if (noError) {
                return;
            }
            const syndrome = new GenericGFPoly(field, syndromeCoefficients);
            const sigmaOmega = this.runEuclideanAlgorithm(field.buildMonomial(twoS, 1), syndrome, twoS);
            const sigma = sigmaOmega[0];
            const omega = sigmaOmega[1];
            const errorLocations = this.findErrorLocations(sigma);
            const errorMagnitudes = this.findErrorMagnitudes(omega, errorLocations);
            for (let i = 0; i < errorLocations.length; i++) {
                const position = received.length - 1 - field.log(errorLocations[i]);
                if (position < 0) {
                    throw new ReedSolomonException('Bad error location');
                }
                received[position] = GenericGF.addOrSubtract(received[position], errorMagnitudes[i]);
            }
        }
        runEuclideanAlgorithm(a, b, R /*int*/) {
            // Assume a's degree is >= b's
            if (a.getDegree() < b.getDegree()) {
                const temp = a;
                a = b;
                b = temp;
            }
            const field = this.field;
            let rLast = a;
            let r = b;
            let tLast = field.getZero();
            let t = field.getOne();
            // Run Euclidean algorithm until r's degree is less than R/2
            while (r.getDegree() >= (R / 2 | 0)) {
                let rLastLast = rLast;
                let tLastLast = tLast;
                rLast = r;
                tLast = t;
                // Divide rLastLast by rLast, with quotient in q and remainder in r
                if (rLast.isZero()) {
                    // Oops, Euclidean algorithm already terminated?
                    throw new ReedSolomonException('r_{i-1} was zero');
                }
                r = rLastLast;
                let q = field.getZero();
                const denominatorLeadingTerm = rLast.getCoefficient(rLast.getDegree());
                const dltInverse = field.inverse(denominatorLeadingTerm);
                while (r.getDegree() >= rLast.getDegree() && !r.isZero()) {
                    const degreeDiff = r.getDegree() - rLast.getDegree();
                    const scale = field.multiply(r.getCoefficient(r.getDegree()), dltInverse);
                    q = q.addOrSubtract(field.buildMonomial(degreeDiff, scale));
                    r = r.addOrSubtract(rLast.multiplyByMonomial(degreeDiff, scale));
                }
                t = q.multiply(tLast).addOrSubtract(tLastLast);
                if (r.getDegree() >= rLast.getDegree()) {
                    throw new IllegalStateException('Division algorithm failed to reduce polynomial?');
                }
            }
            const sigmaTildeAtZero = t.getCoefficient(0);
            if (sigmaTildeAtZero === 0) {
                throw new ReedSolomonException('sigmaTilde(0) was zero');
            }
            const inverse = field.inverse(sigmaTildeAtZero);
            const sigma = t.multiplyScalar(inverse);
            const omega = r.multiplyScalar(inverse);
            return [sigma, omega];
        }
        findErrorLocations(errorLocator) {
            // This is a direct application of Chien's search
            const numErrors = errorLocator.getDegree();
            if (numErrors === 1) { // shortcut
                return Int32Array.from([errorLocator.getCoefficient(1)]);
            }
            const result = new Int32Array(numErrors);
            let e = 0;
            const field = this.field;
            for (let i = 1; i < field.getSize() && e < numErrors; i++) {
                if (errorLocator.evaluateAt(i) === 0) {
                    result[e] = field.inverse(i);
                    e++;
                }
            }
            if (e !== numErrors) {
                throw new ReedSolomonException('Error locator degree does not match number of roots');
            }
            return result;
        }
        findErrorMagnitudes(errorEvaluator, errorLocations) {
            // This is directly applying Forney's Formula
            const s = errorLocations.length;
            const result = new Int32Array(s);
            const field = this.field;
            for (let i = 0; i < s; i++) {
                const xiInverse = field.inverse(errorLocations[i]);
                let denominator = 1;
                for (let j = 0; j < s; j++) {
                    if (i !== j) {
                        // denominator = field.multiply(denominator,
                        //    GenericGF.addOrSubtract(1, field.multiply(errorLocations[j], xiInverse)))
                        // Above should work but fails on some Apple and Linux JDKs due to a Hotspot bug.
                        // Below is a funny-looking workaround from Steven Parkes
                        const term = field.multiply(errorLocations[j], xiInverse);
                        const termPlus1 = (term & 0x1) === 0 ? term | 1 : term & ~1;
                        denominator = field.multiply(denominator, termPlus1);
                    }
                }
                result[i] = field.multiply(errorEvaluator.evaluateAt(xiInverse), field.inverse(denominator));
                if (field.getGeneratorBase() !== 0) {
                    result[i] = field.multiply(result[i], xiInverse);
                }
            }
            return result;
        }
    }
  
    /*
     * Copyright 2010 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    // import java.util.Arrays;
    var Table;
    (function (Table) {
        Table[Table["UPPER"] = 0] = "UPPER";
        Table[Table["LOWER"] = 1] = "LOWER";
        Table[Table["MIXED"] = 2] = "MIXED";
        Table[Table["DIGIT"] = 3] = "DIGIT";
        Table[Table["PUNCT"] = 4] = "PUNCT";
        Table[Table["BINARY"] = 5] = "BINARY";
    })(Table || (Table = {}));
    /**
     * <p>The main class which implements Aztec Code decoding -- as opposed to locating and extracting
     * the Aztec Code from an image.</p>
     *
     * @author David Olivier
     */
    class Decoder {
        decode(detectorResult) {
            this.ddata = detectorResult;
            let matrix = detectorResult.getBits();
            let rawbits = this.extractBits(matrix);
            let correctedBits = this.correctBits(rawbits);
            let rawBytes = Decoder.convertBoolArrayToByteArray(correctedBits);
            let result = Decoder.getEncodedData(correctedBits);
            let decoderResult = new DecoderResult(rawBytes, result, null, null);
            decoderResult.setNumBits(correctedBits.length);
            return decoderResult;
        }
        // This method is used for testing the high-level encoder
        static highLevelDecode(correctedBits) {
            return this.getEncodedData(correctedBits);
        }
        /**
         * Gets the string encoded in the aztec code bits
         *
         * @return the decoded string
         */
        static getEncodedData(correctedBits) {
            let endIndex = correctedBits.length;
            let latchTable = Table.UPPER; // table most recently latched to
            let shiftTable = Table.UPPER; // table to use for the next read
            let result = '';
            let index = 0;
            while (index < endIndex) {
                if (shiftTable === Table.BINARY) {
                    if (endIndex - index < 5) {
                        break;
                    }
                    let length = Decoder.readCode(correctedBits, index, 5);
                    index += 5;
                    if (length === 0) {
                        if (endIndex - index < 11) {
                            break;
                        }
                        length = Decoder.readCode(correctedBits, index, 11) + 31;
                        index += 11;
                    }
                    for (let charCount = 0; charCount < length; charCount++) {
                        if (endIndex - index < 8) {
                            index = endIndex; // Force outer loop to exit
                            break;
                        }
                        const code = Decoder.readCode(correctedBits, index, 8);
                        result += /*(char)*/ StringUtils.castAsNonUtf8Char(code);
                        index += 8;
                    }
                    // Go back to whatever mode we had been in
                    shiftTable = latchTable;
                }
                else {
                    let size = shiftTable === Table.DIGIT ? 4 : 5;
                    if (endIndex - index < size) {
                        break;
                    }
                    let code = Decoder.readCode(correctedBits, index, size);
                    index += size;
                    let str = Decoder.getCharacter(shiftTable, code);
                    if (str.startsWith('CTRL_')) {
                        // Table changes
                        // ISO/IEC 24778:2008 prescribes ending a shift sequence in the mode from which it was invoked.
                        // That's including when that mode is a shift.
                        // Our test case dlusbs.png for issue #642 exercises that.
                        latchTable = shiftTable; // Latch the current mode, so as to return to Upper after U/S B/S
                        shiftTable = Decoder.getTable(str.charAt(5));
                        if (str.charAt(6) === 'L') {
                            latchTable = shiftTable;
                        }
                    }
                    else {
                        result += str;
                        // Go back to whatever mode we had been in
                        shiftTable = latchTable;
                    }
                }
            }
            return result;
        }
        /**
         * gets the table corresponding to the char passed
         */
        static getTable(t) {
            switch (t) {
                case 'L':
                    return Table.LOWER;
                case 'P':
                    return Table.PUNCT;
                case 'M':
                    return Table.MIXED;
                case 'D':
                    return Table.DIGIT;
                case 'B':
                    return Table.BINARY;
                case 'U':
                default:
                    return Table.UPPER;
            }
        }
        /**
         * Gets the character (or string) corresponding to the passed code in the given table
         *
         * @param table the table used
         * @param code the code of the character
         */
        static getCharacter(table, code) {
            switch (table) {
                case Table.UPPER:
                    return Decoder.UPPER_TABLE[code];
                case Table.LOWER:
                    return Decoder.LOWER_TABLE[code];
                case Table.MIXED:
                    return Decoder.MIXED_TABLE[code];
                case Table.PUNCT:
                    return Decoder.PUNCT_TABLE[code];
                case Table.DIGIT:
                    return Decoder.DIGIT_TABLE[code];
                default:
                    // Should not reach here.
                    throw new IllegalStateException('Bad table');
            }
        }
        /**
         * <p>Performs RS error correction on an array of bits.</p>
         *
         * @return the corrected array
         * @throws FormatException if the input contains too many errors
         */
        correctBits(rawbits) {
            let gf;
            let codewordSize;
            if (this.ddata.getNbLayers() <= 2) {
                codewordSize = 6;
                gf = GenericGF.AZTEC_DATA_6;
            }
            else if (this.ddata.getNbLayers() <= 8) {
                codewordSize = 8;
                gf = GenericGF.AZTEC_DATA_8;
            }
            else if (this.ddata.getNbLayers() <= 22) {
                codewordSize = 10;
                gf = GenericGF.AZTEC_DATA_10;
            }
            else {
                codewordSize = 12;
                gf = GenericGF.AZTEC_DATA_12;
            }
            let numDataCodewords = this.ddata.getNbDatablocks();
            let numCodewords = rawbits.length / codewordSize;
            if (numCodewords < numDataCodewords) {
                throw new FormatException();
            }
            let offset = rawbits.length % codewordSize;
            let dataWords = new Int32Array(numCodewords);
            for (let i = 0; i < numCodewords; i++, offset += codewordSize) {
                dataWords[i] = Decoder.readCode(rawbits, offset, codewordSize);
            }
            try {
                let rsDecoder = new ReedSolomonDecoder(gf);
                rsDecoder.decode(dataWords, numCodewords - numDataCodewords);
            }
            catch (ex) {
                throw new FormatException(ex);
            }
            // Now perform the unstuffing operation.
            // First, count how many bits are going to be thrown out as stuffing
            let mask = (1 << codewordSize) - 1;
            let stuffedBits = 0;
            for (let i = 0; i < numDataCodewords; i++) {
                let dataWord = dataWords[i];
                if (dataWord === 0 || dataWord === mask) {
                    throw new FormatException();
                }
                else if (dataWord === 1 || dataWord === mask - 1) {
                    stuffedBits++;
                }
            }
            // Now, actually unpack the bits and remove the stuffing
            let correctedBits = new Array(numDataCodewords * codewordSize - stuffedBits);
            let index = 0;
            for (let i = 0; i < numDataCodewords; i++) {
                let dataWord = dataWords[i];
                if (dataWord === 1 || dataWord === mask - 1) {
                    // next codewordSize-1 bits are all zeros or all ones
                    correctedBits.fill(dataWord > 1, index, index + codewordSize - 1);
                    // Arrays.fill(correctedBits, index, index + codewordSize - 1, dataWord > 1);
                    index += codewordSize - 1;
                }
                else {
                    for (let bit = codewordSize - 1; bit >= 0; --bit) {
                        correctedBits[index++] = (dataWord & (1 << bit)) !== 0;
                    }
                }
            }
            return correctedBits;
        }
        /**
         * Gets the array of bits from an Aztec Code matrix
         *
         * @return the array of bits
         */
        extractBits(matrix) {
            let compact = this.ddata.isCompact();
            let layers = this.ddata.getNbLayers();
            let baseMatrixSize = (compact ? 11 : 14) + layers * 4; // not including alignment lines
            let alignmentMap = new Int32Array(baseMatrixSize);
            let rawbits = new Array(this.totalBitsInLayer(layers, compact));
            if (compact) {
                for (let i = 0; i < alignmentMap.length; i++) {
                    alignmentMap[i] = i;
                }
            }
            else {
                let matrixSize = baseMatrixSize + 1 + 2 * Integer.truncDivision((Integer.truncDivision(baseMatrixSize, 2) - 1), 15);
                let origCenter = baseMatrixSize / 2;
                let center = Integer.truncDivision(matrixSize, 2);
                for (let i = 0; i < origCenter; i++) {
                    let newOffset = i + Integer.truncDivision(i, 15);
                    alignmentMap[origCenter - i - 1] = center - newOffset - 1;
                    alignmentMap[origCenter + i] = center + newOffset + 1;
                }
            }
            for (let i = 0, rowOffset = 0; i < layers; i++) {
                let rowSize = (layers - i) * 4 + (compact ? 9 : 12);
                // The top-left most point of this layer is <low, low> (not including alignment lines)
                let low = i * 2;
                // The bottom-right most point of this layer is <high, high> (not including alignment lines)
                let high = baseMatrixSize - 1 - low;
                // We pull bits from the two 2 x rowSize columns and two rowSize x 2 rows
                for (let j = 0; j < rowSize; j++) {
                    let columnOffset = j * 2;
                    for (let k = 0; k < 2; k++) {
                        // left column
                        rawbits[rowOffset + columnOffset + k] =
                            matrix.get(alignmentMap[low + k], alignmentMap[low + j]);
                        // bottom row
                        rawbits[rowOffset + 2 * rowSize + columnOffset + k] =
                            matrix.get(alignmentMap[low + j], alignmentMap[high - k]);
                        // right column
                        rawbits[rowOffset + 4 * rowSize + columnOffset + k] =
                            matrix.get(alignmentMap[high - k], alignmentMap[high - j]);
                        // top row
                        rawbits[rowOffset + 6 * rowSize + columnOffset + k] =
                            matrix.get(alignmentMap[high - j], alignmentMap[low + k]);
                    }
                }
                rowOffset += rowSize * 8;
            }
            return rawbits;
        }
        /**
         * Reads a code of given length and at given index in an array of bits
         */
        static readCode(rawbits, startIndex, length) {
            let res = 0;
            for (let i = startIndex; i < startIndex + length; i++) {
                res <<= 1;
                if (rawbits[i]) {
                    res |= 0x01;
                }
            }
            return res;
        }
        /**
         * Reads a code of length 8 in an array of bits, padding with zeros
         */
        static readByte(rawbits, startIndex) {
            let n = rawbits.length - startIndex;
            if (n >= 8) {
                return Decoder.readCode(rawbits, startIndex, 8);
            }
            return Decoder.readCode(rawbits, startIndex, n) << (8 - n);
        }
        /**
         * Packs a bit array into bytes, most significant bit first
         */
        static convertBoolArrayToByteArray(boolArr) {
            let byteArr = new Uint8Array((boolArr.length + 7) / 8);
            for (let i = 0; i < byteArr.length; i++) {
                byteArr[i] = Decoder.readByte(boolArr, 8 * i);
            }
            return byteArr;
        }
        totalBitsInLayer(layers, compact) {
            return ((compact ? 88 : 112) + 16 * layers) * layers;
        }
    }
    Decoder.UPPER_TABLE = [
        'CTRL_PS', ' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'CTRL_LL', 'CTRL_ML', 'CTRL_DL', 'CTRL_BS'
    ];
    Decoder.LOWER_TABLE = [
        'CTRL_PS', ' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
        'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'CTRL_US', 'CTRL_ML', 'CTRL_DL', 'CTRL_BS'
    ];
    Decoder.MIXED_TABLE = [
        // Module parse failed: Octal literal in strict mode (50:29)
        // so number string were scaped
        'CTRL_PS', ' ', '\\1', '\\2', '\\3', '\\4', '\\5', '\\6', '\\7', '\b', '\t', '\n',
        '\\13', '\f', '\r', '\\33', '\\34', '\\35', '\\36', '\\37', '@', '\\', '^', '_',
        '`', '|', '~', '\\177', 'CTRL_LL', 'CTRL_UL', 'CTRL_PL', 'CTRL_BS'
    ];
    Decoder.PUNCT_TABLE = [
        '', '\r', '\r\n', '. ', ', ', ': ', '!', '"', '#', '$', '%', '&', '\'', '(', ')',
        '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '[', ']', '{', '}', 'CTRL_UL'
    ];
    Decoder.DIGIT_TABLE = [
        'CTRL_PS', ' ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '.', 'CTRL_UL', 'CTRL_US'
    ];
  
    /*
     * Copyright 2012 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /*namespace com.google.zxing.common.detector {*/
    /**
     * General math-related and numeric utility functions.
     */
    class MathUtils {
        constructor() { }
        /**
         * Ends up being a bit faster than {@link Math#round(float)}. This merely rounds its
         * argument to the nearest int, where x.5 rounds up to x+1. Semantics of this shortcut
         * differ slightly from {@link Math#round(float)} in that half rounds down for negative
         * values. -2.5 rounds to -3, not -2. For purposes here it makes no difference.
         *
         * @param d real value to round
         * @return nearest {@code int}
         */
        static round(d /*float*/) {
            if (NaN === d)
                return 0;
            if (d <= Number.MIN_SAFE_INTEGER)
                return Number.MIN_SAFE_INTEGER;
            if (d >= Number.MAX_SAFE_INTEGER)
                return Number.MAX_SAFE_INTEGER;
            return /*(int) */ (d + (d < 0.0 ? -0.5 : 0.5)) | 0;
        }
        // TYPESCRIPTPORT: maybe remove round method and call directly Math.round, it looks like it doesn't make sense for js
        /**
         * @param aX point A x coordinate
         * @param aY point A y coordinate
         * @param bX point B x coordinate
         * @param bY point B y coordinate
         * @return Euclidean distance between points A and B
         */
        static distance(aX /*float|int*/, aY /*float|int*/, bX /*float|int*/, bY /*float|int*/) {
            const xDiff = aX - bX;
            const yDiff = aY - bY;
            return /*(float) */ Math.sqrt(xDiff * xDiff + yDiff * yDiff);
        }
        /**
         * @param aX point A x coordinate
         * @param aY point A y coordinate
         * @param bX point B x coordinate
         * @param bY point B y coordinate
         * @return Euclidean distance between points A and B
         */
        // public static distance(aX: number /*int*/, aY: number /*int*/, bX: number /*int*/, bY: number /*int*/): float {
        //   const xDiff = aX - bX
        //   const yDiff = aY - bY
        //   return (float) Math.sqrt(xDiff * xDiff + yDiff * yDiff);
        // }
        /**
         * @param array values to sum
         * @return sum of values in array
         */
        static sum(array) {
            let count = 0;
            for (let i = 0, length = array.length; i !== length; i++) {
                const a = array[i];
                count += a;
            }
            return count;
        }
    }
  
    /**
     * Ponyfill for Java's Float class.
     */
    class Float {
        /**
         * SincTS has no difference between int and float, there's all numbers,
         * this is used only to polyfill Java code.
         */
        static floatToIntBits(f) {
            return f;
        }
    }
    /**
     * The float max value in JS is the number max value.
     */
    Float.MAX_VALUE = Number.MAX_SAFE_INTEGER;
  
    /*
     * Copyright 2007 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * <p>Encapsulates a point of interest in an image containing a barcode. Typically, this
     * would be the location of a finder pattern or the corner of the barcode, for example.</p>
     *
     * @author Sean Owen
     */
    class ResultPoint {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        getX() {
            return this.x;
        }
        getY() {
            return this.y;
        }
        /*@Override*/
        equals(other) {
            if (other instanceof ResultPoint) {
                const otherPoint = other;
                return this.x === otherPoint.x && this.y === otherPoint.y;
            }
            return false;
        }
        /*@Override*/
        hashCode() {
            return 31 * Float.floatToIntBits(this.x) + Float.floatToIntBits(this.y);
        }
        /*@Override*/
        toString() {
            return '(' + this.x + ',' + this.y + ')';
        }
        /**
         * Orders an array of three ResultPoints in an order [A,B,C] such that AB is less than AC
         * and BC is less than AC, and the angle between BC and BA is less than 180 degrees.
         *
         * @param patterns array of three {@code ResultPoint} to order
         */
        static orderBestPatterns(patterns) {
            // Find distances between pattern centers
            const zeroOneDistance = this.distance(patterns[0], patterns[1]);
            const oneTwoDistance = this.distance(patterns[1], patterns[2]);
            const zeroTwoDistance = this.distance(patterns[0], patterns[2]);
            let pointA;
            let pointB;
            let pointC;
            // Assume one closest to other two is B; A and C will just be guesses at first
            if (oneTwoDistance >= zeroOneDistance && oneTwoDistance >= zeroTwoDistance) {
                pointB = patterns[0];
                pointA = patterns[1];
                pointC = patterns[2];
            }
            else if (zeroTwoDistance >= oneTwoDistance && zeroTwoDistance >= zeroOneDistance) {
                pointB = patterns[1];
                pointA = patterns[0];
                pointC = patterns[2];
            }
            else {
                pointB = patterns[2];
                pointA = patterns[0];
                pointC = patterns[1];
            }
            // Use cross product to figure out whether A and C are correct or flipped.
            // This asks whether BC x BA has a positive z component, which is the arrangement
            // we want for A, B, C. If it's negative, then we've got it flipped around and
            // should swap A and C.
            if (this.crossProductZ(pointA, pointB, pointC) < 0.0) {
                const temp = pointA;
                pointA = pointC;
                pointC = temp;
            }
            patterns[0] = pointA;
            patterns[1] = pointB;
            patterns[2] = pointC;
        }
        /**
         * @param pattern1 first pattern
         * @param pattern2 second pattern
         * @return distance between two points
         */
        static distance(pattern1, pattern2) {
            return MathUtils.distance(pattern1.x, pattern1.y, pattern2.x, pattern2.y);
        }
        /**
         * Returns the z component of the cross product between vectors BC and BA.
         */
        static crossProductZ(pointA, pointB, pointC) {
            const bX = pointB.x;
            const bY = pointB.y;
            return ((pointC.x - bX) * (pointA.y - bY)) - ((pointC.y - bY) * (pointA.x - bX));
        }
    }
  
    /*
     * Copyright 2007 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * <p>Encapsulates the result of detecting a barcode in an image. This includes the raw
     * matrix of black/white pixels corresponding to the barcode, and possibly points of interest
     * in the image, like the location of finder patterns or corners of the barcode in the image.</p>
     *
     * @author Sean Owen
     */
    class DetectorResult {
        constructor(bits, points) {
            this.bits = bits;
            this.points = points;
        }
        getBits() {
            return this.bits;
        }
        getPoints() {
            return this.points;
        }
    }
  
    /*
     * Copyright 2010 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * <p>Extends {@link DetectorResult} with more information specific to the Aztec format,
     * like the number of layers and whether it's compact.</p>
     *
     * @author Sean Owen
     */
    class AztecDetectorResult extends DetectorResult {
        constructor(bits, points, compact, nbDatablocks, nbLayers) {
            super(bits, points);
            this.compact = compact;
            this.nbDatablocks = nbDatablocks;
            this.nbLayers = nbLayers;
        }
        getNbLayers() {
            return this.nbLayers;
        }
        getNbDatablocks() {
            return this.nbDatablocks;
        }
        isCompact() {
            return this.compact;
        }
    }
  
    /*
     * Copyright 2010 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * <p>
     * Detects a candidate barcode-like rectangular region within an image. It
     * starts around the center of the image, increases the size of the candidate
     * region until it finds a white rectangular region. By keeping track of the
     * last black points it encountered, it determines the corners of the barcode.
     * </p>
     *
     * @author David Olivier
     */
    class WhiteRectangleDetector {
        // public constructor(private image: BitMatrix) /*throws NotFoundException*/ {
        //   this(image, INIT_SIZE, image.getWidth() / 2, image.getHeight() / 2)
        // }
        /**
         * @param image barcode image to find a rectangle in
         * @param initSize initial size of search area around center
         * @param x x position of search center
         * @param y y position of search center
         * @throws NotFoundException if image is too small to accommodate {@code initSize}
         */
        constructor(image, initSize /*int*/, x /*int*/, y /*int*/) {
            this.image = image;
            this.height = image.getHeight();
            this.width = image.getWidth();
            if (undefined === initSize || null === initSize) {
                initSize = WhiteRectangleDetector.INIT_SIZE;
            }
            if (undefined === x || null === x) {
                x = image.getWidth() / 2 | 0;
            }
            if (undefined === y || null === y) {
                y = image.getHeight() / 2 | 0;
            }
            const halfsize = initSize / 2 | 0;
            this.leftInit = x - halfsize;
            this.rightInit = x + halfsize;
            this.upInit = y - halfsize;
            this.downInit = y + halfsize;
            if (this.upInit < 0 || this.leftInit < 0 || this.downInit >= this.height || this.rightInit >= this.width) {
                throw new NotFoundException();
            }
        }
        /**
         * <p>
         * Detects a candidate barcode-like rectangular region within an image. It
         * starts around the center of the image, increases the size of the candidate
         * region until it finds a white rectangular region.
         * </p>
         *
         * @return {@link ResultPoint}[] describing the corners of the rectangular
         *         region. The first and last points are opposed on the diagonal, as
         *         are the second and third. The first point will be the topmost
         *         point and the last, the bottommost. The second point will be
         *         leftmost and the third, the rightmost
         * @throws NotFoundException if no Data Matrix Code can be found
         */
        detect() {
            let left = this.leftInit;
            let right = this.rightInit;
            let up = this.upInit;
            let down = this.downInit;
            let sizeExceeded = false;
            let aBlackPointFoundOnBorder = true;
            let atLeastOneBlackPointFoundOnBorder = false;
            let atLeastOneBlackPointFoundOnRight = false;
            let atLeastOneBlackPointFoundOnBottom = false;
            let atLeastOneBlackPointFoundOnLeft = false;
            let atLeastOneBlackPointFoundOnTop = false;
            const width = this.width;
            const height = this.height;
            while (aBlackPointFoundOnBorder) {
                aBlackPointFoundOnBorder = false;
                // .....
                // .   |
                // .....
                let rightBorderNotWhite = true;
                while ((rightBorderNotWhite || !atLeastOneBlackPointFoundOnRight) && right < width) {
                    rightBorderNotWhite = this.containsBlackPoint(up, down, right, false);
                    if (rightBorderNotWhite) {
                        right++;
                        aBlackPointFoundOnBorder = true;
                        atLeastOneBlackPointFoundOnRight = true;
                    }
                    else if (!atLeastOneBlackPointFoundOnRight) {
                        right++;
                    }
                }
                if (right >= width) {
                    sizeExceeded = true;
                    break;
                }
                // .....
                // .   .
                // .___.
                let bottomBorderNotWhite = true;
                while ((bottomBorderNotWhite || !atLeastOneBlackPointFoundOnBottom) && down < height) {
                    bottomBorderNotWhite = this.containsBlackPoint(left, right, down, true);
                    if (bottomBorderNotWhite) {
                        down++;
                        aBlackPointFoundOnBorder = true;
                        atLeastOneBlackPointFoundOnBottom = true;
                    }
                    else if (!atLeastOneBlackPointFoundOnBottom) {
                        down++;
                    }
                }
                if (down >= height) {
                    sizeExceeded = true;
                    break;
                }
                // .....
                // |   .
                // .....
                let leftBorderNotWhite = true;
                while ((leftBorderNotWhite || !atLeastOneBlackPointFoundOnLeft) && left >= 0) {
                    leftBorderNotWhite = this.containsBlackPoint(up, down, left, false);
                    if (leftBorderNotWhite) {
                        left--;
                        aBlackPointFoundOnBorder = true;
                        atLeastOneBlackPointFoundOnLeft = true;
                    }
                    else if (!atLeastOneBlackPointFoundOnLeft) {
                        left--;
                    }
                }
                if (left < 0) {
                    sizeExceeded = true;
                    break;
                }
                // .___.
                // .   .
                // .....
                let topBorderNotWhite = true;
                while ((topBorderNotWhite || !atLeastOneBlackPointFoundOnTop) && up >= 0) {
                    topBorderNotWhite = this.containsBlackPoint(left, right, up, true);
                    if (topBorderNotWhite) {
                        up--;
                        aBlackPointFoundOnBorder = true;
                        atLeastOneBlackPointFoundOnTop = true;
                    }
                    else if (!atLeastOneBlackPointFoundOnTop) {
                        up--;
                    }
                }
                if (up < 0) {
                    sizeExceeded = true;
                    break;
                }
                if (aBlackPointFoundOnBorder) {
                    atLeastOneBlackPointFoundOnBorder = true;
                }
            }
            if (!sizeExceeded && atLeastOneBlackPointFoundOnBorder) {
                const maxSize = right - left;
                let z = null;
                for (let i = 1; z === null && i < maxSize; i++) {
                    z = this.getBlackPointOnSegment(left, down - i, left + i, down);
                }
                if (z == null) {
                    throw new NotFoundException();
                }
                let t = null;
                // go down right
                for (let i = 1; t === null && i < maxSize; i++) {
                    t = this.getBlackPointOnSegment(left, up + i, left + i, up);
                }
                if (t == null) {
                    throw new NotFoundException();
                }
                let x = null;
                // go down left
                for (let i = 1; x === null && i < maxSize; i++) {
                    x = this.getBlackPointOnSegment(right, up + i, right - i, up);
                }
                if (x == null) {
                    throw new NotFoundException();
                }
                let y = null;
                // go up left
                for (let i = 1; y === null && i < maxSize; i++) {
                    y = this.getBlackPointOnSegment(right, down - i, right - i, down);
                }
                if (y == null) {
                    throw new NotFoundException();
                }
                return this.centerEdges(y, z, x, t);
            }
            else {
                throw new NotFoundException();
            }
        }
        getBlackPointOnSegment(aX /*float*/, aY /*float*/, bX /*float*/, bY /*float*/) {
            const dist = MathUtils.round(MathUtils.distance(aX, aY, bX, bY));
            const xStep = (bX - aX) / dist;
            const yStep = (bY - aY) / dist;
            const image = this.image;
            for (let i = 0; i < dist; i++) {
                const x = MathUtils.round(aX + i * xStep);
                const y = MathUtils.round(aY + i * yStep);
                if (image.get(x, y)) {
                    return new ResultPoint(x, y);
                }
            }
            return null;
        }
        /**
         * recenters the points of a constant distance towards the center
         *
         * @param y bottom most point
         * @param z left most point
         * @param x right most point
         * @param t top most point
         * @return {@link ResultPoint}[] describing the corners of the rectangular
         *         region. The first and last points are opposed on the diagonal, as
         *         are the second and third. The first point will be the topmost
         *         point and the last, the bottommost. The second point will be
         *         leftmost and the third, the rightmost
         */
        centerEdges(y, z, x, t) {
            //
            //       t            t
            //  z                      x
            //        x    OR    z
            //   y                    y
            //
            const yi = y.getX();
            const yj = y.getY();
            const zi = z.getX();
            const zj = z.getY();
            const xi = x.getX();
            const xj = x.getY();
            const ti = t.getX();
            const tj = t.getY();
            const CORR = WhiteRectangleDetector.CORR;
            if (yi < this.width / 2.0) {
                return [
                    new ResultPoint(ti - CORR, tj + CORR),
                    new ResultPoint(zi + CORR, zj + CORR),
                    new ResultPoint(xi - CORR, xj - CORR),
                    new ResultPoint(yi + CORR, yj - CORR)
                ];
            }
            else {
                return [
                    new ResultPoint(ti + CORR, tj + CORR),
                    new ResultPoint(zi + CORR, zj - CORR),
                    new ResultPoint(xi - CORR, xj + CORR),
                    new ResultPoint(yi - CORR, yj - CORR)
                ];
            }
        }
        /**
         * Determines whether a segment contains a black point
         *
         * @param a          min value of the scanned coordinate
         * @param b          max value of the scanned coordinate
         * @param fixed      value of fixed coordinate
         * @param horizontal set to true if scan must be horizontal, false if vertical
         * @return true if a black point has been found, else false.
         */
        containsBlackPoint(a /*int*/, b /*int*/, fixed /*int*/, horizontal) {
            const image = this.image;
            if (horizontal) {
                for (let x = a; x <= b; x++) {
                    if (image.get(x, fixed)) {
                        return true;
                    }
                }
            }
            else {
                for (let y = a; y <= b; y++) {
                    if (image.get(fixed, y)) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
    WhiteRectangleDetector.INIT_SIZE = 10;
    WhiteRectangleDetector.CORR = 1;
  
    /*
     * Copyright 2007 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Implementations of this class can, given locations of finder patterns for a QR code in an
     * image, sample the right points in the image to reconstruct the QR code, accounting for
     * perspective distortion. It is abstracted since it is relatively expensive and should be allowed
     * to take advantage of platform-specific optimized implementations, like Sun's Java Advanced
     * Imaging library, but which may not be available in other environments such as J2ME, and vice
     * versa.
     *
     * The implementation used can be controlled by calling {@link #setGridSampler(GridSampler)}
     * with an instance of a class which implements this interface.
     *
     * @author Sean Owen
     */
    class GridSampler {
        /**
         * <p>Checks a set of points that have been transformed to sample points on an image against
         * the image's dimensions to see if the point are even within the image.</p>
         *
         * <p>This method will actually "nudge" the endpoints back onto the image if they are found to be
         * barely (less than 1 pixel) off the image. This accounts for imperfect detection of finder
         * patterns in an image where the QR Code runs all the way to the image border.</p>
         *
         * <p>For efficiency, the method will check points from either end of the line until one is found
         * to be within the image. Because the set of points are assumed to be linear, this is valid.</p>
         *
         * @param image image into which the points should map
         * @param points actual points in x1,y1,...,xn,yn form
         * @throws NotFoundException if an endpoint is lies outside the image boundaries
         */
        static checkAndNudgePoints(image, points) {
            const width = image.getWidth();
            const height = image.getHeight();
            // Check and nudge points from start until we see some that are OK:
            let nudged = true;
            for (let offset = 0; offset < points.length && nudged; offset += 2) {
                const x = Math.floor(points[offset]);
                const y = Math.floor(points[offset + 1]);
                if (x < -1 || x > width || y < -1 || y > height) {
                    throw new NotFoundException();
                }
                nudged = false;
                if (x === -1) {
                    points[offset] = 0.0;
                    nudged = true;
                }
                else if (x === width) {
                    points[offset] = width - 1;
                    nudged = true;
                }
                if (y === -1) {
                    points[offset + 1] = 0.0;
                    nudged = true;
                }
                else if (y === height) {
                    points[offset + 1] = height - 1;
                    nudged = true;
                }
            }
            // Check and nudge points from end:
            nudged = true;
            for (let offset = points.length - 2; offset >= 0 && nudged; offset -= 2) {
                const x = Math.floor(points[offset]);
                const y = Math.floor(points[offset + 1]);
                if (x < -1 || x > width || y < -1 || y > height) {
                    throw new NotFoundException();
                }
                nudged = false;
                if (x === -1) {
                    points[offset] = 0.0;
                    nudged = true;
                }
                else if (x === width) {
                    points[offset] = width - 1;
                    nudged = true;
                }
                if (y === -1) {
                    points[offset + 1] = 0.0;
                    nudged = true;
                }
                else if (y === height) {
                    points[offset + 1] = height - 1;
                    nudged = true;
                }
            }
        }
    }
  
    /*
     * Copyright 2007 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /*namespace com.google.zxing.common {*/
    /**
     * <p>This class implements a perspective transform in two dimensions. Given four source and four
     * destination points, it will compute the transformation implied between them. The code is based
     * directly upon section 3.4.2 of George Wolberg's "Digital Image Warping"; see pages 54-56.</p>
     *
     * @author Sean Owen
     */
    class PerspectiveTransform {
        constructor(a11 /*float*/, a21 /*float*/, a31 /*float*/, a12 /*float*/, a22 /*float*/, a32 /*float*/, a13 /*float*/, a23 /*float*/, a33 /*float*/) {
            this.a11 = a11;
            this.a21 = a21;
            this.a31 = a31;
            this.a12 = a12;
            this.a22 = a22;
            this.a32 = a32;
            this.a13 = a13;
            this.a23 = a23;
            this.a33 = a33;
        }
        static quadrilateralToQuadrilateral(x0 /*float*/, y0 /*float*/, x1 /*float*/, y1 /*float*/, x2 /*float*/, y2 /*float*/, x3 /*float*/, y3 /*float*/, x0p /*float*/, y0p /*float*/, x1p /*float*/, y1p /*float*/, x2p /*float*/, y2p /*float*/, x3p /*float*/, y3p /*float*/) {
            const qToS = PerspectiveTransform.quadrilateralToSquare(x0, y0, x1, y1, x2, y2, x3, y3);
            const sToQ = PerspectiveTransform.squareToQuadrilateral(x0p, y0p, x1p, y1p, x2p, y2p, x3p, y3p);
            return sToQ.times(qToS);
        }
        transformPoints(points) {
            const max = points.length;
            const a11 = this.a11;
            const a12 = this.a12;
            const a13 = this.a13;
            const a21 = this.a21;
            const a22 = this.a22;
            const a23 = this.a23;
            const a31 = this.a31;
            const a32 = this.a32;
            const a33 = this.a33;
            for (let i = 0; i < max; i += 2) {
                const x = points[i];
                const y = points[i + 1];
                const denominator = a13 * x + a23 * y + a33;
                points[i] = (a11 * x + a21 * y + a31) / denominator;
                points[i + 1] = (a12 * x + a22 * y + a32) / denominator;
            }
        }
        transformPointsWithValues(xValues, yValues) {
            const a11 = this.a11;
            const a12 = this.a12;
            const a13 = this.a13;
            const a21 = this.a21;
            const a22 = this.a22;
            const a23 = this.a23;
            const a31 = this.a31;
            const a32 = this.a32;
            const a33 = this.a33;
            const n = xValues.length;
            for (let i = 0; i < n; i++) {
                const x = xValues[i];
                const y = yValues[i];
                const denominator = a13 * x + a23 * y + a33;
                xValues[i] = (a11 * x + a21 * y + a31) / denominator;
                yValues[i] = (a12 * x + a22 * y + a32) / denominator;
            }
        }
        static squareToQuadrilateral(x0 /*float*/, y0 /*float*/, x1 /*float*/, y1 /*float*/, x2 /*float*/, y2 /*float*/, x3 /*float*/, y3 /*float*/) {
            const dx3 = x0 - x1 + x2 - x3;
            const dy3 = y0 - y1 + y2 - y3;
            if (dx3 === 0.0 && dy3 === 0.0) {
                // Affine
                return new PerspectiveTransform(x1 - x0, x2 - x1, x0, y1 - y0, y2 - y1, y0, 0.0, 0.0, 1.0);
            }
            else {
                const dx1 = x1 - x2;
                const dx2 = x3 - x2;
                const dy1 = y1 - y2;
                const dy2 = y3 - y2;
                const denominator = dx1 * dy2 - dx2 * dy1;
                const a13 = (dx3 * dy2 - dx2 * dy3) / denominator;
                const a23 = (dx1 * dy3 - dx3 * dy1) / denominator;
                return new PerspectiveTransform(x1 - x0 + a13 * x1, x3 - x0 + a23 * x3, x0, y1 - y0 + a13 * y1, y3 - y0 + a23 * y3, y0, a13, a23, 1.0);
            }
        }
        static quadrilateralToSquare(x0 /*float*/, y0 /*float*/, x1 /*float*/, y1 /*float*/, x2 /*float*/, y2 /*float*/, x3 /*float*/, y3 /*float*/) {
            // Here, the adjoint serves as the inverse:
            return PerspectiveTransform.squareToQuadrilateral(x0, y0, x1, y1, x2, y2, x3, y3).buildAdjoint();
        }
        buildAdjoint() {
            // Adjoint is the transpose of the cofactor matrix:
            return new PerspectiveTransform(this.a22 * this.a33 - this.a23 * this.a32, this.a23 * this.a31 - this.a21 * this.a33, this.a21 * this.a32 - this.a22 * this.a31, this.a13 * this.a32 - this.a12 * this.a33, this.a11 * this.a33 - this.a13 * this.a31, this.a12 * this.a31 - this.a11 * this.a32, this.a12 * this.a23 - this.a13 * this.a22, this.a13 * this.a21 - this.a11 * this.a23, this.a11 * this.a22 - this.a12 * this.a21);
        }
        times(other) {
            return new PerspectiveTransform(this.a11 * other.a11 + this.a21 * other.a12 + this.a31 * other.a13, this.a11 * other.a21 + this.a21 * other.a22 + this.a31 * other.a23, this.a11 * other.a31 + this.a21 * other.a32 + this.a31 * other.a33, this.a12 * other.a11 + this.a22 * other.a12 + this.a32 * other.a13, this.a12 * other.a21 + this.a22 * other.a22 + this.a32 * other.a23, this.a12 * other.a31 + this.a22 * other.a32 + this.a32 * other.a33, this.a13 * other.a11 + this.a23 * other.a12 + this.a33 * other.a13, this.a13 * other.a21 + this.a23 * other.a22 + this.a33 * other.a23, this.a13 * other.a31 + this.a23 * other.a32 + this.a33 * other.a33);
        }
    }
  
    /*
     * Copyright 2007 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * @author Sean Owen
     */
    class DefaultGridSampler extends GridSampler {
        /*@Override*/
        sampleGrid(image, dimensionX /*int*/, dimensionY /*int*/, p1ToX /*float*/, p1ToY /*float*/, p2ToX /*float*/, p2ToY /*float*/, p3ToX /*float*/, p3ToY /*float*/, p4ToX /*float*/, p4ToY /*float*/, p1FromX /*float*/, p1FromY /*float*/, p2FromX /*float*/, p2FromY /*float*/, p3FromX /*float*/, p3FromY /*float*/, p4FromX /*float*/, p4FromY /*float*/) {
            const transform = PerspectiveTransform.quadrilateralToQuadrilateral(p1ToX, p1ToY, p2ToX, p2ToY, p3ToX, p3ToY, p4ToX, p4ToY, p1FromX, p1FromY, p2FromX, p2FromY, p3FromX, p3FromY, p4FromX, p4FromY);
            return this.sampleGridWithTransform(image, dimensionX, dimensionY, transform);
        }
        /*@Override*/
        sampleGridWithTransform(image, dimensionX /*int*/, dimensionY /*int*/, transform) {
            if (dimensionX <= 0 || dimensionY <= 0) {
                throw new NotFoundException();
            }
            const bits = new BitMatrix(dimensionX, dimensionY);
            const points = new Float32Array(2 * dimensionX);
            for (let y = 0; y < dimensionY; y++) {
                const max = points.length;
                const iValue = y + 0.5;
                for (let x = 0; x < max; x += 2) {
                    points[x] = (x / 2) + 0.5;
                    points[x + 1] = iValue;
                }
                transform.transformPoints(points);
                // Quick check to see if points transformed to something inside the image
                // sufficient to check the endpoints
                GridSampler.checkAndNudgePoints(image, points);
                try {
                    for (let x = 0; x < max; x += 2) {
                        if (image.get(Math.floor(points[x]), Math.floor(points[x + 1]))) {
                            // Black(-ish) pixel
                            bits.set(x / 2, y);
                        }
                    }
                }
                catch (aioobe /*: ArrayIndexOutOfBoundsException*/) {
                    // This feels wrong, but, sometimes if the finder patterns are misidentified, the resulting
                    // transform gets "twisted" such that it maps a straight line of points to a set of points
                    // whose endpoints are in bounds, but others are not. There is probably some mathematical
                    // way to detect this about the transformation that I don't know yet.
                    // This results in an ugly runtime exception despite our clever checks above -- can't have
                    // that. We could check each point's coordinates but that feels duplicative. We settle for
                    // catching and wrapping ArrayIndexOutOfBoundsException.
                    throw new NotFoundException();
                }
            }
            return bits;
        }
    }
  
    class GridSamplerInstance {
        /**
         * Sets the implementation of GridSampler used by the library. One global
         * instance is stored, which may sound problematic. But, the implementation provided
         * ought to be appropriate for the entire platform, and all uses of this library
         * in the whole lifetime of the JVM. For instance, an Android activity can swap in
         * an implementation that takes advantage of native platform libraries.
         *
         * @param newGridSampler The platform-specific object to install.
         */
        static setGridSampler(newGridSampler) {
            GridSamplerInstance.gridSampler = newGridSampler;
        }
        /**
         * @return the current implementation of GridSampler
         */
        static getInstance() {
            return GridSamplerInstance.gridSampler;
        }
    }
    GridSamplerInstance.gridSampler = new DefaultGridSampler();
  
    /*
     * Copyright 2010 ZXing authors
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        toResultPoint() {
            return new ResultPoint(this.getX(), this.getY());
        }
        getX() {
            return this.x;
        }
        getY() {
            return this.y;
        }
    }
    /**
     * Encapsulates logic that can detect an Aztec Code in an image, even if the Aztec Code
     * is rotated or skewed, or partially obscured.
     *
     * @author David Olivier
     * @author Frank Yellin
     */
    class Detector {
        constructor(image) {
            this.EXPECTED_CORNER_BITS = new Int32Array([
                0xee0,
                0x1dc,
                0x83b,
                0x707,
            ]);
            this.image = image;
        }
        detect() {
            return this.detectMirror(false);
        }
        /**
         * Detects an Aztec Code in an image.
         *
         * @param isMirror if true, image is a mirror-image of original
         * @return {@link AztecDetectorResult} encapsulating results of detecting an Aztec Code
         * @throws NotFoundException if no Aztec Code can be found
         */
        detectMirror(isMirror) {
            // 1. Get the center of the aztec matrix
            let pCenter = this.getMatrixCenter();
            // 2. Get the center points of the four diagonal points just outside the bull's eye
            //  [topRight, bottomRight, bottomLeft, topLeft]
            let bullsEyeCorners = this.getBullsEyeCorners(pCenter);
            if (isMirror) {
                let temp = bullsEyeCorners[0];
                bullsEyeCorners[0] = bullsEyeCorners[2];
                bullsEyeCorners[2] = temp;
            }
            // 3. Get the size of the matrix and other parameters from the bull's eye
            this.extractParameters(bullsEyeCorners);
            // 4. Sample the grid
            let bits = this.sampleGrid(this.image, bullsEyeCorners[this.shift % 4], bullsEyeCorners[(this.shift + 1) % 4], bullsEyeCorners[(this.shift + 2) % 4], bullsEyeCorners[(this.shift + 3) % 4]);
            // 5. Get the corners of the matrix.
            let corners = this.getMatrixCornerPoints(bullsEyeCorners);
            return new AztecDetectorResult(bits, corners, this.compact, this.nbDataBlocks, this.nbLayers);
        }
        /**
         * Extracts the number of data layers and data blocks from the layer around the bull's eye.
         *
         * @param bullsEyeCorners the array of bull's eye corners
         * @throws NotFoundException in case of too many errors or invalid parameters
         */
        extractParameters(bullsEyeCorners) {
            if (!this.isValidPoint(bullsEyeCorners[0]) || !this.isValidPoint(bullsEyeCorners[1]) ||
                !this.isValidPoint(bullsEyeCorners[2]) || !this.isValidPoint(bullsEyeCorners[3])) {
                throw new NotFoundException();
            }
            let length = 2 * this.nbCenterLayers;
            // Get the bits around the bull's eye
            let sides = new Int32Array([
                this.sampleLine(bullsEyeCorners[0], bullsEyeCorners[1], length),
                this.sampleLine(bullsEyeCorners[1], bullsEyeCorners[2], length),
                this.sampleLine(bullsEyeCorners[2], bullsEyeCorners[3], length),
                this.sampleLine(bullsEyeCorners[3], bullsEyeCorners[0], length) // Top
            ]);
            // bullsEyeCorners[shift] is the corner of the bulls'eye that has three
            // orientation marks.
            // sides[shift] is the row/column that goes from the corner with three
            // orientation marks to the corner with two.
            this.shift = this.getRotation(sides, length);
            // Flatten the parameter bits into a single 28- or 40-bit long
            let parameterData = 0;
            for (let i = 0; i < 4; i++) {
                let side = sides[(this.shift + i) % 4];
                if (this.compact) {
                    // Each side of the form ..XXXXXXX. where Xs are parameter data
                    parameterData <<= 7;
                    parameterData += (side >> 1) & 0x7F;
                }
                else {
                    // Each side of the form ..XXXXX.XXXXX. where Xs are parameter data
                    parameterData <<= 10;
                    parameterData += ((side >> 2) & (0x1f << 5)) + ((side >> 1) & 0x1F);
                }
            }
            // Corrects parameter data using RS.  Returns just the data portion
            // without the error correction.
            let correctedData = this.getCorrectedParameterData(parameterData, this.compact);
            if (this.compact) {
                // 8 bits:  2 bits layers and 6 bits data blocks
                this.nbLayers = (correctedData >> 6) + 1;
                this.nbDataBlocks = (correctedData & 0x3F) + 1;
            }
            else {
                // 16 bits:  5 bits layers and 11 bits data blocks
                this.nbLayers = (correctedData >> 11) + 1;
                this.nbDataBlocks = (correctedData & 0x7FF) + 1;
            }
        }
        getRotation(sides, length) {
            // In a normal pattern, we expect to See
            //   **    .*             D       A
            //   *      *
            //
            //   .      *
            //   ..    ..             C       B
            //
            // Grab the 3 bits from each of the sides the form the locator pattern and concatenate
            // into a 12-bit integer.  Start with the bit at A
            let cornerBits = 0;
            sides.forEach((side, idx, arr) => {
                // XX......X where X's are orientation marks
                let t = ((side >> (length - 2)) << 1) + (side & 1);
                cornerBits = (cornerBits << 3) + t;
            });
            // for (var side in sides) {
            //     // XX......X where X's are orientation marks
            //     var t = ((side >> (length - 2)) << 1) + (side & 1);
            //     cornerBits = (cornerBits << 3) + t;
            // }
            // Mov the bottom bit to the top, so that the three bits of the locator pattern at A are
            // together.  cornerBits is now:
            //  3 orientation bits at A || 3 orientation bits at B || ... || 3 orientation bits at D
            cornerBits = ((cornerBits & 1) << 11) + (cornerBits >> 1);
            // The result shift indicates which element of BullsEyeCorners[] goes into the top-left
            // corner. Since the four rotation values have a Hamming distance of 8, we
            // can easily tolerate two errors.
            for (let shift = 0; shift < 4; shift++) {
                if (Integer.bitCount(cornerBits ^ this.EXPECTED_CORNER_BITS[shift]) <= 2) {
                    return shift;
                }
            }
            throw new NotFoundException();
        }
        /**
         * Corrects the parameter bits using Reed-Solomon algorithm.
         *
         * @param parameterData parameter bits
         * @param compact true if this is a compact Aztec code
         * @throws NotFoundException if the array contains too many errors
         */
        getCorrectedParameterData(parameterData, compact) {
            let numCodewords;
            let numDataCodewords;
            if (compact) {
                numCodewords = 7;
                numDataCodewords = 2;
            }
            else {
                numCodewords = 10;
                numDataCodewords = 4;
            }
            let numECCodewords = numCodewords - numDataCodewords;
            let parameterWords = new Int32Array(numCodewords);
            for (let i = numCodewords - 1; i >= 0; --i) {
                parameterWords[i] = parameterData & 0xF;
                parameterData >>= 4;
            }
            try {
                let rsDecoder = new ReedSolomonDecoder(GenericGF.AZTEC_PARAM);
                rsDecoder.decode(parameterWords, numECCodewords);
            }
            catch (ignored) {
                throw new NotFoundException();
            }
            // Toss the error correction.  Just return the data as an integer
            let result = 0;
            for (let i = 0; i < numDataCodewords; i++) {
                result = (result << 4) + parameterWords[i];
            }
            return result;
        }
        /**
         * Finds the corners of a bull-eye centered on the passed point.
         * This returns the centers of the diagonal points just outside the bull's eye
         * Returns [topRight, bottomRight, bottomLeft, topLeft]
         *
         * @param pCenter Center point
         * @return The corners of the bull-eye
         * @throws NotFoundException If no valid bull-eye can be found
         */
        getBullsEyeCorners(pCenter) {
            let pina = pCenter;
            let pinb = pCenter;
            let pinc = pCenter;
            let pind = pCenter;
            let color = true;
            for (this.nbCenterLayers = 1; this.nbCenterLayers < 9; this.nbCenterLayers++) {
                let pouta = this.getFirstDifferent(pina, color, 1, -1);
                let poutb = this.getFirstDifferent(pinb, color, 1, 1);
                let poutc = this.getFirstDifferent(pinc, color, -1, 1);
                let poutd = this.getFirstDifferent(pind, color, -1, -1);
                // d      a
                //
                // c      b
                if (this.nbCenterLayers > 2) {
                    let q = (this.distancePoint(poutd, pouta) * this.nbCenterLayers) / (this.distancePoint(pind, pina) * (this.nbCenterLayers + 2));
                    if (q < 0.75 || q > 1.25 || !this.isWhiteOrBlackRectangle(pouta, poutb, poutc, poutd)) {
                        break;
     