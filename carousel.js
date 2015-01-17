$(document).ready(function () {
    $.widget("powerbi.carousel", {
        options: {
            data: [],
            itemHeight: 60,
            itemWidth: 60,
            maxItems: 5,
            margins: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            },
            heightDelta: 0,
            delay: 2,
            interval: 0.5,
            dataProperty: 'background-color',
            __intervalId: 0
        },
        _create: function () {
            if (!this._validate()) {
                return;
            }
            var element = this.element.addClass("carousel");
            var label = $('<div class="label"/>');
            var delay = this.options.delay;
            label.css('position', 'absolute');
            element.append(label);

            for (var i = 0; i <= this.options.maxItems; i++) {
                var tile = $('<div class="tile"/>');

                tile.css({
                    position: 'absolute',
                    '-webkit-transition-property': 'top, left, width, height',
                    '-webkit-transition-duration': delay + 's',
                    'transition-property': 'top, left, width, height',
                    'transition-duration': delay + 's'
                });

                element.append(tile);
            }
            this._update(0);
        },

        _setOption: function (key, value) {
            this.options[key] = value;
            this._update(0);
        },
        _validate: function () {
            if (this.options.data.length < this.options.maxItems + 1) {
                console.error('data length must be > maxItems + 1');
                return false;
            }
            if (this.options.maxItems < 3) {
                console.error('maxItems cannot be less than 3');
                return false;
            }
            if (this.options.maxItems % 2 === 0) {
                console.error('maxItems have to be an odd number');
                return false;
            }
            return true;
        },
        _update: function (n) {
            var options = this.options;
            var delay = this.options.delay * 1000;
            var interval = this.options.interval * 1000;
            var element = this.element;
            var height = element.height();
            var width = element.width();
            var tiles = element.find('.tile');
            var itemHeight = options.itemHeight;
            var itemWidth = options.itemWidth;
            var maxItems = options.maxItems;
            var margins = options.margins;
            var dataProp = this.options.dataProperty;
            var leftOffset = margins.left;
            var padding = (width - (margins.left + margins.right + maxItems * itemWidth)) / (maxItems - 1);

            for (var i = n; i < maxItems; i++) {
                var tile = $(tiles[i - n + 1]);
                var resizeCorrection = 0;

                if (i === Math.floor(maxItems / 2)) {
                    resizeCorrection = Math.floor(itemWidth * 0.20);
                    tile.css({
                        height: itemHeight + resizeCorrection * 2,
                        width: itemWidth + resizeCorrection * 2
                    });

                    var label = element.find('.label');
                    var that = this;
                    if (n === 1) {
                        var heightFactor = i + 1;
                        var top = height - ((heightFactor) * itemHeight)
                            + that.options.heightDelta * (heightFactor - 1)
                            + itemHeight + resizeCorrection * 2 + 10;

                        label.fadeOut(delay / 4, "linear", function () {
                            label.text(that.options.data[Math.floor(maxItems / 2) - n + 1].label)
                                .css('font-size', '30px');
                            label.css({
                                top: top,
                                left: width / 2 - label.width() / 2
                            });
                            label.fadeIn(delay / 4 * 3, "linear");
                        });
                    } else {
                        var heightFactor = i + 1;
                        label.text(this.options.data[i - n + 1].label).css('font-size', '30px');
                        label.css({
                            top: height - ((heightFactor) * itemHeight)
                            + this.options.heightDelta * (heightFactor - 1)
                            + itemHeight + resizeCorrection * 2 + 10,
                            left: width / 2 - label.width() / 2
                        });
                    }

                } else {
                    tile.css({
                        height: itemHeight,
                        width: itemWidth
                    });
                }
                var heightFactor = i > Math.floor(maxItems / 2) ? maxItems - i : i + 1;
                var heightDelta = i === 0 || i === maxItems - 1 ? 0 : this.options.heightDelta;
                tile.css({
                    top: height - ((heightFactor) * itemHeight) + heightDelta * (heightFactor - 1),
                    left: ((i * itemWidth) + leftOffset + (padding * i)) - resizeCorrection,
                    'background-size': 'contain'
                });

                tile.css(dataProp, this.options.data[i - n + 1].background);
            }

            if (n == 1) {
                $(tiles[maxItems]).css({
                    top: height,
                    left: width,
                    'background-size': 'contain'
                });

                $(tiles[maxItems]).css(dataProp, this.options.data[maxItems]);

                $(tiles[0]).css({
                    top: height - itemHeight,
                    left: leftOffset,
                    'background-size': 'contain'
                });

                $(tiles[0]).css(dataProp, this.options.data[0].background);

                var that = this;

                setTimeout(function () {
                    that.options.data.unshift(that.options.data.pop());
                    var last = $(tiles[maxItems]);
                    last.css({
                        height: itemHeight,
                        width: itemWidth,
                        top: height,
                        left: -itemWidth,
                        'background-size': 'contain'
                    });
                    last.css(dataProp, that.options.data[0].background);
                    last.parent().prepend(last);
                }, delay);
            }

            if (n == 0) {
                $(tiles[0]).css({
                    height: itemHeight,
                    width: itemWidth,
                    top: height,
                    left: -itemWidth,
                    'background-size': 'contain'
                });
                $(tiles[0]).css(dataProp, this.options.data[0].background);
            }
        },

        start: function () {
            var that = this;
            this.stop();
            this.options.__intervalId = setInterval(function () {
                that._update(1);
            }, (this.options.delay + this.options.interval) * 1000);
        },
        stop: function () {
            clearInterval(this.options.__intervalId);
        }
    });
});