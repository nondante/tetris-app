class Play { 
  constructor(canvas, ctx, ucanvas, uctx, cb){
    this.canvas = canvas;
    this.ctx = ctx;
    this.ucanvas = ucanvas;
    this.uctx = uctx;
    this.cb = cb;

    this.KEY = { ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };
    this.DIR = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3, MIN: 0, MAX: 3 };
    this.speed = { start: 0.6, decrement: 0.005, min: 0.1 }; // how long before piece drops by 1 row (seconds)
    this.nx = 10; // width of tetris court (in blocks)
    this.ny = 20; // height of tetris court (in blocks)
    this.nu = 5;  // width/height of upcoming preview (in blocks)

    this.dx = null; 
    this.dy=null;        // pixel size of a single tetris block
    this.blocks=null;        // 2 dimensional array (nx*ny) representing tetris court - either empty block or occupied by a 'piece'
    this.actions=null;       // queue of user actions (inputs)
    this.playing=null;       // true|false - game is in progress
    this.dt=null;            // time since starting this game
    this.current=null;       // the current piece
    this.next=null;          // the next piece
    this.score=null;         // the current score
    this.vscore=null;       // the currently displayed score (it catches up to score in small chunks - like a spinning slot machine)
    this.rows=null;          // number of completed rows in the current game
    this.step=null; 

    this.i = { size: 4, blocks: [0x0F00, 0x2222, 0x00F0, 0x4444], color: 'cyan'   };
    this.j = { size: 3, blocks: [0x44C0, 0x8E00, 0x6440, 0x0E20], color: 'blue'   };
    this.l = { size: 3, blocks: [0x4460, 0x0E80, 0xC440, 0x2E00], color: 'orange' };
    this.o = { size: 2, blocks: [0xCC00, 0xCC00, 0xCC00, 0xCC00], color: 'yellow' };
    this.s = { size: 3, blocks: [0x06C0, 0x8C40, 0x6C00, 0x4620], color: 'green'  };
    this.t = { size: 3, blocks: [0x0E40, 0x4C40, 0x4E00, 0x4640], color: 'purple' };
    this.z = { size: 3, blocks: [0x0C60, 0x4C80, 0xC600, 0x2640], color: 'red'    };

    this.pieces = [];
    this.invalid = {};
  }
  
  //-------------------------------------------------------------------------
    // base helper methods
    //-------------------------------------------------------------------------

   get = (id) => { return document.getElementById(id);  }
   hide = (id) => { this.get(id).style.visibility = 'hidden'; }
   show = (id) => { this.get(id).style.visibility = null;}
   html = (id, html) => { this.get(id).innerHTML = html; }

   timestamp = () => { return new Date().getTime(); }
   random = (min, max) => { return (min + (Math.random() * (max - min))); }
   randomChoice = (choices) => { return choices[Math.round(this.random(0, choices.length-1))]; }

   requestanimationframe = () => {
   if (!window.requestAnimationFrame) { // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
                                    window.mozRequestAnimationFrame    ||
                                    window.oRequestAnimationFrame      ||
                                    window.msRequestAnimationFrame     ||
                                    function(callback, element) {
                                      window.setTimeout(callback, 1000 / 60);
                                    }
    } 
   }

    eachblock = (type, x, y, dir, fn) => {
      var bit, row = 0, col = 0, blocks = type.blocks[dir];
      for(bit = 0x8000 ; bit > 0 ; bit = bit >> 1) {
        if (blocks & bit) {
          fn(x + col, y + row);
        }
        if (++col === 4) {
          col = 0;
          ++row;
        }
      }
    }

    occupied = (type, x, y, dir) => {
      var result = false
      this.eachblock(type, x, y, dir, (x, y) => {
        if ((x < 0) || (x >= this.nx) || (y < 0) || (y >= this.ny) || this.getBlock(x,y))
          result = true;
      });
      return result;
    }

    unoccupied = (type, x, y, dir) => {
      return !this.occupied(type, x, y, dir);
    }

    randomPiece = () => {
      if (this.pieces.length === 0)
        this.pieces = [this.i,this.i,this.i,this.i,this.j,this.j,this.j,this.j,this.l,this.l,this.l,this.l,this.o,this.o,this.o,this.o,this.s,this.s,this.s,this.s,this.t,this.t,this.t,this.t,this.z,this.z,this.z,this.z];
      var type = this.pieces.splice(this.random(0, this.pieces.length-1), 1)[0];
      return { type: type, dir: this.DIR.UP, x: Math.round(this.random(0, this.nx - type.size)), y: 0 };
    }

    run = () => {
      this.requestanimationframe();
      this.addEvents(); // attach keydown and resize events
      this.play();
      var now = this.timestamp();
      var last = now = this.timestamp();
      const frame = () => {
        now = this.timestamp();
        this.update(Math.min(1, (now - last) / 1000.0)); // using requestAnimationFrame have to be able to handle large delta's caused when it 'hibernates' in a background or non-visible tab
        this.draw();
        last = now;
        requestAnimationFrame(frame, this.canvas);
      }

      this.resize(); // setup all our sizing information
      this.reset();  // reset the per-game variables
      frame();  // start the first frame

    }



    addEvents = () => {
      document.addEventListener('keydown', this.keydown, false);
      window.addEventListener('resize', this.resize, false);
    }

    resize = (event) => {
      this.canvas.width   = this.canvas.clientWidth;  // set canvas logical size equal to its physical size
      this.canvas.height  = this.canvas.clientHeight; // (ditto)
      this.ucanvas.width  = this.ucanvas.clientWidth;
      this.ucanvas.height = this.ucanvas.clientHeight;
      this.dx = this.canvas.width  / this.nx; // pixel size of a single tetris block
      this.dy = this.canvas.height / this.ny; // (ditto)
      this.invalidate();
      this.invalidateNext();
    }

    keydown = (ev) => {
      var handled = false;
      if (this.playing) {
        switch(ev.keyCode) {
          case this.KEY.LEFT:   this.actions.push(this.DIR.LEFT);  handled = true; break;
          case this.KEY.RIGHT:  this.actions.push(this.DIR.RIGHT); handled = true; break;
          case this.KEY.UP:     this.actions.push(this.DIR.UP);    handled = true; break;
          case this.KEY.DOWN:   this.actions.push(this.DIR.DOWN);  handled = true; break;
          case this.KEY.ESC:    this.lose();                  handled = true; break;
          default: handled=true;
        }
      }
      
      if (handled)
        ev.preventDefault(); // prevent arrow keys from scrolling the page (supported in IE9+ and all other browsers)
    }

    play = () => { this.reset(); this.playing = true;  }
    lose = () => { 
      this.setVisualScore(); 
      this.playing = false;
      this.cb(this.getScore()); 
    }

   

    setVisualScore = (n) =>      { this.vscore = n || this.score; this.invalidateScore(); }
    setScore = (n) =>         { this.score = n; this.setVisualScore(n);  }
    addScore = (n) =>           { this.score = this.score + n;   }
    clearScore = () =>         { this.setScore(0); }
    getScore = () => { return this.vscore }
    clearRows = () =>        { this.setRows(0); }
    setRows = (n) =>            { this.rows = n; this.step = Math.max(this.speed.min, this.speed.start - (this.speed.decrement*this.rows)); this.invalidateRows(); }
    addRows = (n) =>        { this.setRows(this.rows + n); }
    getBlock = (x,y) =>      { return (this.blocks && this.blocks[x] ? this.blocks[x][y] : null); }
    setBlock = (x,y,type) =>     { this.blocks[x] = this.blocks[x] || []; this.blocks[x][y] = type; this.invalidate(); }
    clearBlocks = () =>        { this.blocks = []; this.invalidate(); }
    clearActions = () =>        { this.actions = []; }
    setCurrentPiece = (piece) => { this.current = piece || this.randomPiece(); this.invalidate();     }
    setNextPiece = (piece) =>    { this.next    = piece || this.randomPiece(); this.invalidateNext(); }

    reset = () => {
      this.dt = 0;
      this.clearActions();
      this.clearBlocks();
      this.clearRows();
      this.clearScore();
      this.setCurrentPiece(this.next);
      this.setNextPiece();
    }

    update = (idt) => {
      if (this.playing) {
        if (this.vscore < this.score)
          this.setVisualScore(this.vscore + 1);
        this.handle(this.actions.shift());
        this.dt = this.dt + idt;
        if (this.dt > this.step) {
          this.dt = this.dt - this.step;
          this.drop();
        }
        
      }
    }

    handle = (action) => {
      switch(action) {
        case this.DIR.LEFT:  this.move(this.DIR.LEFT);  break;
        case this.DIR.RIGHT: this.move(this.DIR.RIGHT); break;
        case this.DIR.UP:    this.rotate();        break;
        case this.DIR.DOWN:  this.drop();          break;
        default:;
      }
    }

    move = (dir) => {
      var x = this.current.x, y = this.current.y;
      switch(dir) {
        case this.DIR.RIGHT: x = x + 1; break;
        case this.DIR.LEFT:  x = x - 1; break;
        case this.DIR.DOWN:  y = y + 1; break;
        default:;
      }
      if (this.unoccupied(this.current.type, x, y, this.current.dir)) {
        this.current.x = x;
        this.current.y = y;
        this.invalidate();
        return true;
      }
      else {
        return false;
      }
    }

    rotate = () => {
      var newdir = (this.current.dir === this.DIR.MAX ? this.DIR.MIN : this.current.dir + 1);
      if (this.unoccupied(this.current.type, this.current.x, this.current.y, this.newdir)) {
        this.current.dir = newdir;
        this.invalidate();
      }
    }

    drop = () => {
      if (!this.move(this.DIR.DOWN)) {
        this.addScore(10);
        this.dropPiece();
        this.removeLines();
        this.setCurrentPiece(this.next);
        this.setNextPiece(this.randomPiece());
        this.clearActions();
        if (this.occupied(this.current.type, this.current.x, this.current.y, this.current.dir)) {
          this.lose();
        }
      }
    }

    dropPiece = () => {
      this.eachblock(this.current.type, this.current.x, this.current.y, this.current.dir, (x, y) => {
        this.setBlock(x, y, this.current.type);
      });
    }

    removeLines = () => {
      var x, y, complete, n = 0;
      for(y = this.ny ; y > 0 ; --y) {
        complete = true;
        for(x = 0 ; x < this.nx ; ++x) {
          if (!this.getBlock(x, y))
            complete = false;
        }
        if (complete) {
          this.removeLine(y);
          y = y + 1; // recheck same line
          n++;
        }
      }
      if (n > 0) {
        this.addRows(n);
        this.addScore(100*Math.pow(2,n-1)); // 1: 100, 2: 200, 3: 400, 4: 800
      }
    }

    removeLine = (n) => {
      var x, y;
      for(y = n ; y >= 0 ; --y) {
        for(x = 0 ; x < this.nx ; ++x)
          this.setBlock(x, y, (y === 0) ? null : this.getBlock(x, y-1));
      }
    }


    invalidate = ()     =>    { this.invalid.court  = true; }
    invalidateNext = () =>    { this.invalid.next   = true; }
    invalidateScore = () =>   { this.invalid.score  = true; }
    invalidateRows = ()  =>   { this.invalid.rows   = true; }

    draw = () => {
      this.ctx.save();
      this.ctx.lineWidth = 1;
      this.ctx.translate(0.5, 0.5); // for crisp 1px black lines
      this.drawCourt();
      this.drawNext();
      this.drawScore();
      this.drawRows();
      this.ctx.restore();
    }

    drawCourt = () => {
      if (this.invalid.court) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.playing)
          this.drawPiece(this.ctx, this.current.type, this.current.x, this.current.y, this.current.dir);
        var x, y, block;
        for(y = 0 ; y < this.ny ; y++) {
          for (x = 0 ; x < this.nx ; x++) {
            if (block = this.getBlock(x,y))
              this.drawBlock(this.ctx, x, y, block.color);
          }
        }
        this.ctx.strokeRect(0, 0, this.nx*this.dx - 1, this.ny*this.dy - 1); // court boundary
        this.invalid.court = false;
      }
    }

    drawNext = () => {
      if (this.invalid.next) {
        var padding = (this.nu - this.next.type.size) / 2; // half-arsed attempt at centering next piece display
        this.uctx.save();
        this.uctx.translate(0.5, 0.5);
        this.uctx.clearRect(0, 0, this.nu*this.dx, this.nu*this.dy);
        this.drawPiece(this.uctx, this.next.type, padding, padding, this.next.dir);
        this.uctx.strokeStyle = 'black';
        this.uctx.strokeRect(0, 0, this.nu*this.dx - 1, this.nu*this.dy - 1);
        this.uctx.restore();
        this.invalid.next = false;
      }
    }

    drawScore = () => {
      if (this.invalid.score) {
        this.html('score', ("00000" + Math.floor(this.vscore)).slice(-5));
        this.invalid.score = false;
      }
    }

    drawRows = () => {
      if (this.invalid.rows) {
        this.html('rows', this.rows);
        this.invalid.rows = false;
      }
    }

    drawPiece = (ctx, type, x, y, dir) => {
      this.eachblock(type, x, y, dir, (x, y) => {
        this.drawBlock(ctx, x, y, type.color);
      });
    }

    drawBlock = (ctx, x, y, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(x*this.dx, y*this.dy, this.dx, this.dy);
      ctx.strokeRect(x*this.dx, y*this.dy, this.dx, this.dy)
    }



}
export default Play