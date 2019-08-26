
    window.document.documentElement.style.fontSize = 20*window.document.documentElement.clientWidth/500+'px';
    function Wrap() {
        this.banner = document.getElementById('banner');
        this.ul = this.banner.getElementsByTagName('ul')[0];
        this.oldlen = this.ul.children.length;
        this.liWidth = this.ul.children[1].offsetWidth;
        this.ul.insertBefore(this.ul.children[this.oldlen-1].cloneNode(true),this.ul.childNodes[0]);
        this.ul.appendChild(this.ul.children[1].cloneNode(true));
        // 记录移动的距离变量 永久唯一
        this.banner_left = -this.liWidth;
        Wrap.transform.call(this, this.banner_left);
        // 是否可以清空定时器
        this.isLoop = false;
        this.isStart = false;
        // 判断是否是第一次进入页面
        this.first = true;
        // 初始化
        this.init();

        this.loop = this.auplay();

    }
    Wrap.prototype.init = function() {
        var that = this;
        this.ul.addEventListener('touchstart',function (ev) {
            console.log(that.isLoop);
            // 清空定时器 条件是 动画执行完成并且我开始点击
            that.isStart = true;
            if (that.isLoop||that.first) {
                clearTimeout(that.loop);
                that.ul.addEventListener('touchmove',fnmove,false);
                that.ul.addEventListener('touchend',fnend,false)
            } else {
                return
            }
            var dir = ''; //方向确定
            that.ul.style.transition = that.ul.style.webkitTransition = '';
            ev.preventDefault();
            var e = ev.changedTouches[0];
            var start = { x : e.clientX-that.banner_left };
            var startmove = { x:e.clientX,y:e.clientY  };
            // 阈值5
            function fnmove(e) {
                ev.preventDefault();
                if (dir) {
                    if (dir === 'l') {
                        that.banner_left = e.changedTouches[0].clientX - start.x;
                        Wrap.transform.call(that, that.banner_left)
                    }

                } else {
                    if (Math.abs(e.changedTouches[0].clientX -startmove.x)>=5 ) {
                        dir = 'l'
                    }  else if (Math.abs(e.changedTouches[0].clientY -startmove.y)>=5) {
                        dir = 't'
                    }
                }
            }
            function fnend() {
                that.ul.removeEventListener('touchmove',fnmove,false);
                that.ul.removeEventListener('touchend',fnend,false);
                // that.isStart = false;
                if (dir === 'l') {
                    var num = Math.round(that.banner_left/that.liWidth);
                    console.log(num);
                    if (Math.abs(num) ===0) {
                        num = -that.oldlen;
                        Wrap.transform.call(that, (that.banner_left+(num*that.liWidth)));
                    } else if(Math.abs(num)>=(that.ul.children.length-1)) {
                        num = -1;
                        var s= (that.banner_left+((that.ul.children.length-1)*that.liWidth)); // 这是一个过度width
                        console.log((-(that.liWidth-s)))
                        Wrap.transform.call(that, (-(that.liWidth-s)));
                    }
                    that.banner_left = num*that.banner.offsetWidth; // 必须要在dom元素上取  否则会有不可意思的事情发生
                    //ul.children[0].offsetWidth必须要在dom上取 如果用liWidth上会发生回滚
                    that.ul.style.transition= that.ul.style.webkitTransition = 'all .7s ease';
                    Wrap.transform.call(that, (that.banner_left));
                }
            }

        },false);
    };
    Wrap.prototype.auplay = function () {
        var num = Math.round(this.banner_left/this.liWidth);
        return Wrap.time.call(this,num);

    };
    Wrap.transform = function (width) {
        this.banner_left = width;
        this.ul.style.webkitTransform=this.ul.style.transform = 'translateX('+this.banner_left+'px) translateZ(.1px)';
    };
    Wrap.time = function(num) {
        var that = this;
        var number = num;
        var a;
        a =f();
        this.ul.addEventListener('webkitTransitionEnd',b);
        function b() {
            clearTimeout(a);
            that.isLoop = true;
            if (that.isStart) return;
                    if (Math.abs(number)===6&&!that.isStart) {
                        number = 0;
                        that.ul.style.transition= that.ul.style.webkitTransition = '';
                        Wrap.transform.call(that,number*that.banner.offsetWidth);
                        a = f();
                    } else if(Math.abs(number)===0&&!that.isStart){
                        number = -that.oldlen;
                        that.ul.style.transition= that.ul.style.webkitTransition = '';
                        Wrap.transform.call(that,-that.oldlen*that.liWidth);
                        a = f();
                    } else{
                        a =f()
                    }

        }
        function f() {
                return setTimeout(()=>{
                    that.isLoop = false;
                    that.first = false;
                    number--;
                    that.ul.style.transition= that.ul.style.webkitTransition = 'all .5s ease-in';
                    Wrap.transform.call(that,number*that.banner.offsetWidth);
                },2000);

        }
        return a;
    };
    // 重新定位
    Wrap.relocation = function () {
        console.log(this.banner_left);
        var num = this.banner_left/this.liWidth;
        if (this.banner_left===0) {
            Wrap.transform.call(this,-this.oldlen*this.liWidth);
        } else if (Math.abs(num)>=this.oldlen) {
            Wrap.transform.call(this,0);
        }
    };

